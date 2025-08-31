// public/script.js
document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('/logs');
    const logs = await res.json();

    const table = document.querySelector('#logTable tbody');
    logs.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${new Date(log.timestamp).toLocaleString()}</td>
          <td>${log.from}</td>
          <td>${log.message}</td>
          <td>${log.reply}</td>
        `;
        table.appendChild(row);
    });

    // Chart
    const ctx = document.getElementById('logChart').getContext('2d');
    const times = logs.map(l => new Date(l.timestamp).toLocaleTimeString());
    const counts = logs.map(() => 1);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: times,
            datasets: [{
                label: 'Mesej',
                data: counts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});