import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import './Admin.css';

const Reports = () => {
  const [reportType, setReportType] = useState('date');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReport();
  }, [reportType, dateRange]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getReports({
        type: reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      setReportData(reportType === 'doctor' ? response.data.report : response.data.report || []);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
        <p>Generate and view clinic reports</p>
      </div>

      {/* Report Type Selection */}
      <div className="card mb-4">
        <div className="flex gap-4 items-center">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="form-select"
            >
              <option value="date">Date-wise Report</option>
              <option value="doctor">Doctor-wise Report</option>
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="form-input"
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Report Results */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            {reportType === 'date' ? 'Date-wise Appointment Report' : 'Doctor-wise Appointment Report'}
          </h3>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Generating report...</p>
          </div>
        ) : reportData.length > 0 ? (
          reportType === 'date' ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Appointments</th>
                    <th>Scheduled</th>
                    <th>Completed</th>
                    <th>Cancelled</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td className="font-medium">{item.total}</td>
                      <td>{item.scheduled}</td>
                      <td className="text-success">{item.completed}</td>
                      <td className="text-error">{item.cancelled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Total Appointments</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td className="font-medium">
                        Dr. {item.doctor?.firstName} {item.doctor?.lastName}
                      </td>
                      <td>{item.specialization}</td>
                      <td className="font-medium">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="empty-state">
            <p>No data available for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
