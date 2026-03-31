export default function WelcomeCard({ name }) {
  return (
    <div className="welcome-card">
      <img src="/chatbot_image/chatbot.png" alt="CareBridge" />
      <h3>Hey {name}, how can I assist you today?</h3>
      <p>Search patient records, retrieve lab results, conditions, medications, encounters, and procedures.</p>
    </div>
  );
}
