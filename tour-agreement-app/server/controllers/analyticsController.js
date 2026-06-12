const asyncHandler = require("../utils/asyncHandler")
const {
  getMonthlyBookings,
  getMonthlyRevenue,
  getVehicleStats,
  getStatusDistribution,
  getCashTotals,
  getMonthlyCashFlow,
} = require("../services/analyticsService")
const Agreement = require("../models/Agreement")

exports.getSummary = asyncHandler(async (req, res) => {
  const [total, pending, approved, rejected] = await Promise.all([
    Agreement.countDocuments(),
    Agreement.countDocuments({ status: "pending" }),
    Agreement.countDocuments({ status: "approved" }),
    Agreement.countDocuments({ status: "rejected" }),
  ])

  const totalRevenue = await Agreement.aggregate([
    { $match: { status: "approved", packageRate: { $exists: true, $ne: null } } },
    { $group: { _id: null, total: { $sum: { $toDouble: "$packageRate" } } } },
  ])

  res.json({
    success: true,
    data: {
      total,
      pending,
      approved,
      rejected,
      totalRevenue: totalRevenue[0]?.total || 0,
    },
  })
})

exports.getCharts = asyncHandler(async (req, res) => {
  const [monthlyBookings, monthlyRevenue, vehicleStats, statusDistribution, monthlyCashFlow] =
    await Promise.all([
      getMonthlyBookings(),
      getMonthlyRevenue(),
      getVehicleStats(),
      getStatusDistribution(),
      getMonthlyCashFlow(),
    ])

  res.json({
    success: true,
    data: {
      monthlyBookings,
      monthlyRevenue,
      vehicleStats,
      statusDistribution,
      monthlyCashFlow,
    },
  })
})
