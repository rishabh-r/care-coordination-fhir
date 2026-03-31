import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'chart.js/auto';
import { simpleMarkdown } from '../utils/markdown';
import { extractChartData } from '../utils/chart';
import { formatTime } from '../utils/formatters';

export default function MessageBubble({ role, text, userInitial, isStreaming, userMessage, currentPatient }) {
  const navigate = useNavigate();
  const isBot = role === "bot";
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const bubbleRef = useRef(null);

  const { cleanText, chartData } = extractChartData(text || "");

  useEffect(() => {
    if (chartData && chartRef.current && !chartInstanceRef.current) {
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: chartData.labels,
          datasets: [{
            label: chartData.title || "Data",
            data: chartData.values,
            backgroundColor: "rgba(13,148,136,0.1)",
            borderColor: "#0d9488",
            borderWidth: 2,
            pointBackgroundColor: "#0f766e",
            pointRadius: 4,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: !!chartData.title, text: chartData.title || "", font: { size: 13 } }
          },
          scales: {
            y: { beginAtZero: false, grid: { color: "#f0f0f0" } },
            x: { grid: { display: false } }
          }
        }
      });
    }
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [chartData, isStreaming]);

  // Append CareCord button for care gap queries
  const showCareCordButton = isBot && !isStreaming && userMessage && userMessage.toLowerCase().includes("care gap");

  return (
    <div className={`msg-row ${isBot ? 'bot' : 'user'}`}>
      {isBot ? (
        <>
          <div>
            <img src="/chatbot_image/chatbot.png" alt="CareBridge" className="msg-avatar" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
            <div
              ref={bubbleRef}
              className="msg-bubble"
              dangerouslySetInnerHTML={{ __html: simpleMarkdown(cleanText) }}
            />
            {chartData && !isStreaming && (
              <div style={{ marginTop: '14px', maxWidth: '440px', background: '#f8fafc', borderRadius: '10px', padding: '12px' }}>
                <canvas ref={chartRef} />
              </div>
            )}
            {showCareCordButton && (
              <>
                <br />
                <button
                  style={{
                    display: 'inline-block',
                    marginTop: '10px',
                    padding: '6px 14px',
                    background: 'transparent',
                    color: '#0d9488',
                    border: '1px solid #0d9488',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.target.style.background = '#0d9488'; e.target.style.color = '#fff'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#0d9488'; }}
                  onClick={() => {
                    const patientId = currentPatient?.id || 'unknown';
                    navigate(`/patient/${patientId}`, { state: { careGapAnalysis: text } });
                  }}
                >
                  Launch CareCord AI
                </button>
              </>
            )}
            <span className="msg-time">{formatTime()}</span>
          </div>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '80%' }}>
            <div className="msg-bubble">{text}</div>
            <span className="msg-time">{formatTime()}</span>
          </div>
          <div className="msg-avatar user-av">{userInitial}</div>
        </>
      )}
    </div>
  );
}
