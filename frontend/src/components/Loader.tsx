const Loader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh", // Full screen height
    backgroundColor: "#f9f9f9", // Optional background color
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3", // Light border
    borderTop: "5px solid #3498db", // Spinner color
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Add spinner animation
const spinnerAnimation = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = spinnerAnimation;
document.head.appendChild(styleSheet);

export default Loader;
