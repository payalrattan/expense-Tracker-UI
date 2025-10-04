"use client";
import { useEffect, useState, useRef } from "react";
import { getIncome } from "@/services/income-services/incomeServices";
import { getExpenses } from "@/services/expense-services/expensesServices";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "./reports.module.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

type Transaction = {
  _id?: string;
  amount: number;
  date: string;
  source?: string;
  category?: string;
  description?: string;
};

type ReportType = "month" | "day" | "week" | "year" | "custom";

export function Reports() {
  const [income, setIncome] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [reportType, setReportType] = useState<ReportType>("month");
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  ); // YYYY-MM
  const [day, setDay] = useState<string>(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [week, setWeek] = useState<string>(getCurrentWeek()); // YYYY-Www
  const [year, setYear] = useState<string>(new Date().getFullYear().toString()); // YYYY
  const [customStart, setCustomStart] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [customEnd, setCustomEnd] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [incomeData, expenseData] = await Promise.all([
        getIncome(),
        getExpenses(),
      ]);
      setIncome(incomeData);
      setExpenses(expenseData);
    };
    fetchData();
  }, []);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("report.pdf");
  };

  // Helper for week range
  function getCurrentWeek() {
    const now = new Date();
    const year = now.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear =
      (now.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
    );
    return `${year}-W${String(weekNumber).padStart(2, "0")}`;
  }

  // Filter data based on report type
  let filteredIncome: Transaction[] = [];
  let filteredExpenses: Transaction[] = [];
  let labels: string[] = [];

  if (reportType === "month") {
    filteredIncome = income.filter((inc) => inc.date.slice(0, 7) === month);
    filteredExpenses = expenses.filter((exp) => exp.date.slice(0, 7) === month);
    const daysInMonth = new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(5, 7)),
      0
    ).getDate();
    labels = Array.from(
      { length: daysInMonth },
      (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`
    );
  } else if (reportType === "day") {
    filteredIncome = income.filter((inc) => inc.date.slice(0, 10) === day);
    filteredExpenses = expenses.filter((exp) => exp.date.slice(0, 10) === day);
    labels = [day];
  } else if (reportType === "week") {
    // Get week start/end
    const [yearStr, weekStr] = week.split("-W");
    const yearNum = Number(yearStr);
    const weekNum = Number(weekStr);
    const firstDayOfYear = new Date(yearNum, 0, 1);
    const daysOffset = (weekNum - 1) * 7 - firstDayOfYear.getDay();
    const weekStart = new Date(yearNum, 0, 1 + daysOffset);
    const weekDates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      weekDates.push(d.toISOString().slice(0, 10));
    }
    filteredIncome = income.filter((inc) =>
      weekDates.includes(inc.date.slice(0, 10))
    );
    filteredExpenses = expenses.filter((exp) =>
      weekDates.includes(exp.date.slice(0, 10))
    );
    labels = weekDates;
  } else if (reportType === "year") {
    filteredIncome = income.filter((inc) => inc.date.slice(0, 4) === year);
    filteredExpenses = expenses.filter((exp) => exp.date.slice(0, 4) === year);
    labels = Array.from(
      { length: 12 },
      (_, i) => `${year}-${String(i + 1).padStart(2, "0")}`
    );
  } else if (reportType === "custom") {
    filteredIncome = income.filter(
      (inc) =>
        inc.date.slice(0, 10) >= customStart &&
        inc.date.slice(0, 10) <= customEnd
    );
    filteredExpenses = expenses.filter(
      (exp) =>
        exp.date.slice(0, 10) >= customStart &&
        exp.date.slice(0, 10) <= customEnd
    );
    // Labels: all dates in range
    const startDate = new Date(customStart);
    const endDate = new Date(customEnd);
    labels = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      labels.push(d.toISOString().slice(0, 10));
    }
  }

  // Section 1: Totals
  const totalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  // Section 2: Tabular data
  const tableRows: {
    date: string;
    income?: number;
    expense?: number;
    source?: string;
    category?: string;
    description?: string;
  }[] = [];
  filteredIncome.forEach((inc) => {
    tableRows.push({
      date: inc.date.slice(0, 10),
      income: inc.amount,
      source: inc.source,
      description: inc.description,
    });
  });
  filteredExpenses.forEach((exp) => {
    tableRows.push({
      date: exp.date.slice(0, 10),
      expense: exp.amount,
      category: exp.category,
      description: exp.description,
    });
  });
  tableRows.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Section 3: Chart data
  const incomeByLabel = labels.map((label) =>
    filteredIncome
      .filter(
        (inc) =>
          inc.date.slice(0, 10) === label ||
          inc.date.slice(0, 7) === label ||
          inc.date.slice(0, 4) === label
      )
      .reduce((sum, inc) => sum + inc.amount, 0)
  );
  const expenseByLabel = labels.map((label) =>
    filteredExpenses
      .filter(
        (exp) =>
          exp.date.slice(0, 10) === label ||
          exp.date.slice(0, 7) === label ||
          exp.date.slice(0, 4) === label
      )
      .reduce((sum, exp) => sum + exp.amount, 0)
  );
  const chartData = {
    labels,
    datasets: [
      {
        label: "Income",
        data: incomeByLabel,
        borderColor: "#38a169",
        backgroundColor: "rgba(56,161,105,0.08)",
        tension: 0.3,
      },
      {
        label: "Expense",
        data: expenseByLabel,
        borderColor: "#e53e3e",
        backgroundColor: "rgba(229,62,62,0.08)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className={styles.reportsContainer} ref={reportRef}>
      <h2
        style={{
          textAlign: "center",
          fontWeight: 700,
          fontSize: 28,
          color: "#3182ce",
          marginBottom: 24,
        }}
      >
        Report
      </h2>
      {/* Export PDF Button */}
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <button
          onClick={handleExportPDF}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            background: "#3182ce",
            color: "#fff",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Export as PDF
        </button>
      </div>
      {/* Report Type Picker */}
      <div className={styles.reportTypePicker}>
        <label style={{ fontWeight: 600, marginRight: 8 }}>Report Type:</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value as ReportType)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #3182ce",
            fontSize: 16,
            marginRight: 12,
          }}
        >
          <option value="month">Month</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="year">Year</option>
          <option value="custom">Custom Range</option>
        </select>
        {reportType === "month" && (
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #3182ce",
              fontSize: 16,
            }}
          />
        )}
        {reportType === "day" && (
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #3182ce",
              fontSize: 16,
            }}
          />
        )}
        {reportType === "week" && (
          <input
            type="week"
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #3182ce",
              fontSize: 16,
            }}
          />
        )}
        {reportType === "year" && (
          <input
            type="number"
            min="2000"
            max="2100"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              border: "1px solid #3182ce",
              fontSize: 16,
              width: 100,
            }}
          />
        )}
        {reportType === "custom" && (
          <>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #3182ce",
                fontSize: 16,
                marginRight: 8,
              }}
            />
            <span style={{ margin: "0 8px" }}>to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              style={{
                padding: "6px 12px",
                borderRadius: 6,
                border: "1px solid #3182ce",
                fontSize: 16,
              }}
            />
          </>
        )}
      </div>
      {/* Section 1: Monthly Totals */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 32,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: "#e6fffa",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(56,161,105,0.08)",
            padding: 24,
            textAlign: "center",
            border: "2px solid #38a169",
          }}
        >
          <strong style={{ color: "#38a169", fontSize: 18 }}>
            Total Income
          </strong>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 8,
              color: "#38a169",
            }}
          >
            {totalIncome}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: "#fff5f5",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(229,62,62,0.08)",
            padding: 24,
            textAlign: "center",
            border: "2px solid #e53e3e",
          }}
        >
          <strong style={{ color: "#e53e3e", fontSize: 18 }}>
            Total Expenses
          </strong>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 8,
              color: "#e53e3e",
            }}
          >
            {totalExpenses}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            background: "#ebf8ff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
            padding: 24,
            textAlign: "center",
            border: "2px solid #3182ce",
          }}
        >
          <strong style={{ color: "#3182ce", fontSize: 18 }}>
            Total Balance
          </strong>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 8,
              color: "#3182ce",
            }}
          >
            {totalIncome - totalExpenses}
          </div>
        </div>
      </div>
      {/* Section 2: Tabular Data */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
          padding: 24,
          marginBottom: 32,
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 22,
            color: "#3182ce",
            marginBottom: 16,
          }}
        >
          Income & Expense Details
        </h3>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 15 }}
        >
          <thead>
            <tr style={{ background: "#e3fcec" }}>
              <th style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                Date
              </th>
              <th style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                Income
              </th>
              <th style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                Source
              </th>
              <th style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                Expense
              </th>
              <th style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                Category
              </th>
              <th style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                  {row.date}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    color: "#38a169",
                  }}
                >
                  {row.income || ""}
                </td>
                <td style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                  {row.source || ""}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #e0e0e0",
                    color: "#e53e3e",
                  }}
                >
                  {row.expense || ""}
                </td>
                <td style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                  {row.category || ""}
                </td>
                <td style={{ padding: "8px", border: "1px solid #e0e0e0" }}>
                  {row.description || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Section 3: Chart */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 2px 8px rgba(49,130,206,0.08)",
          padding: 32,
          marginBottom: 32,
          maxWidth: "100%",
          minHeight: 350,
        }}
      >
        <h3
          style={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: 22,
            color: "#3182ce",
            marginBottom: 24,
          }}
        >
          {reportType === "month"
            ? "Monthly Day-wise Income & Expense"
            : reportType === "day"
            ? "Day Report"
            : reportType === "week"
            ? "Week Report"
            : reportType === "year"
            ? "Year Report"
            : "Custom Range Report"}
        </h3>
        <Line data={chartData} />
      </div>
    </div>
  );
}
