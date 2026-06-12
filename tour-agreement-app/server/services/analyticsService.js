const Agreement = require("../models/Agreement")

const getMonthlyBookings = async () => {
  return Agreement.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 },
    {
      $project: {
        _id: 0,
        month: {
          $dateToString: {
            format: "%b %Y",
            date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } },
          },
        },
        count: 1,
      },
    },
  ])
}

const getMonthlyRevenue = async () => {
  return Agreement.aggregate([
    { $match: { status: "approved", packageRate: { $exists: true, $ne: null } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: { $toDouble: "$packageRate" } },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 12 },
    {
      $project: {
        _id: 0,
        month: {
          $dateToString: {
            format: "%b %Y",
            date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } },
          },
        },
        revenue: 1,
      },
    },
  ])
}

const getVehicleStats = async () => {
  return Agreement.aggregate([
    { $match: { status: "approved", vehicleName: { $exists: true, $ne: null } } },
    { $group: { _id: "$vehicleName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, vehicle: "$_id", count: 1 } },
  ])
}

const getStatusDistribution = async () => {
  return Agreement.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } },
  ])
}

/** All-time sums: advance (booking) + cashIn + cashOut fields */
const getCashTotals = async () => {
  const r = await Agreement.aggregate([
    {
      $group: {
        _id: null,
        advanceTotal: { $sum: { $ifNull: ["$advancePayment", 0] } },
        cashInTotal: { $sum: { $ifNull: ["$cashIn", 0] } },
        cashOutTotal: { $sum: { $ifNull: ["$cashOut", 0] } },
      },
    },
  ])
  const row = r[0] || { advanceTotal: 0, cashInTotal: 0, cashOutTotal: 0 }
  const advanceTotal = Number(row.advanceTotal) || 0
  const cashInTotal = Number(row.cashInTotal) || 0
  const cashOutTotal = Number(row.cashOutTotal) || 0
  return {
    advanceTotal,
    cashInTotal,
    totalCashIn: advanceTotal + cashInTotal,
    cashOutTotal,
  }
}

/** Per month (by agreement createdAt): advance, extra cash in, combined in, cash out */
const getMonthlyCashFlow = async () => {
  return Agreement.aggregate([
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        advanceTotal: { $sum: { $ifNull: ["$advancePayment", 0] } },
        cashInTotal: { $sum: { $ifNull: ["$cashIn", 0] } },
        cashOutTotal: { $sum: { $ifNull: ["$cashOut", 0] } },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    { $limit: 24 },
    {
      $project: {
        _id: 0,
        month: {
          $dateToString: {
            format: "%b %Y",
            date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } },
          },
        },
        advanceTotal: 1,
        cashInTotal: 1,
        cashOutTotal: 1,
        totalCashIn: { $add: [{ $ifNull: ["$advanceTotal", 0] }, { $ifNull: ["$cashInTotal", 0] }] },
      },
    },
  ])
}

module.exports = {
  getMonthlyBookings,
  getMonthlyRevenue,
  getVehicleStats,
  getStatusDistribution,
  getCashTotals,
  getMonthlyCashFlow,
}
