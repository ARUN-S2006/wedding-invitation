const responsesMessage = document.getElementById("responses-message");
const responsesTableBody = document.querySelector("#responses-table tbody");

function setMessage(text) {
  if (responsesMessage) {
    responsesMessage.innerText = text;
  }
}

function formatTimestamp(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

function addResponseRow(data) {
  if (!responsesTableBody) return;

  const row = document.createElement("tr");
  const date = formatTimestamp(data.timestamp);
  const email = data.email || "Not Provided";
  const message = data.message || "-";

  row.innerHTML = `
    <td>${date}</td>
    <td>${data.name || "Anonymous"}</td>
    <td>${email}</td>
    <td>${data.attendance || "-"}</td>
    <td>${data.guests != null ? data.guests : "-"}</td>
    <td>${message}</td>
  `;

  responsesTableBody.appendChild(row);
}

async function loadResponses() {
  try {
    const response = await fetch("/api/rsvps");
    if (!response.ok) {
      throw new Error("Unable to load RSVP responses.");
    }

    const rows = await response.json();
    if (!rows.length) {
      setMessage("No RSVP responses have been recorded yet.");
      return;
    }

    setMessage(`Showing ${rows.length} RSVP response(s).`);
    rows.forEach(addResponseRow);
  } catch (error) {
    console.error("Error loading RSVP responses:", error);
    setMessage("Failed to load RSVP responses. Make sure the local server is running.");
  }
}

loadResponses();
