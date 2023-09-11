const { differenceInDays } = require('date-fns');
const fs = require('fs');

// delete saved logs after 30 days
const deleteLogs = () => {
  const folderPath = 'logging';
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = `${folderPath}/${file}`;

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        console.info('Error reading the file');
        return;
      }
      if (data) {
        const oldJsonData = JSON.parse(data);
        const oldLogs = oldJsonData.logsData.logs;
        const updatedLogs = oldLogs.filter((log) => {
          const dateString = log.timestamp;
          const dateParts = dateString.split(', ')[0].split('.');
          const timeParts = dateString.split(', ')[1].split(':');
          const formattedDate = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]} ${timeParts[0]}:${timeParts[1]}:${timeParts[2]}`;
          const convertedDate = new Date(formattedDate);
          const leftDays = differenceInDays(new Date(), convertedDate);
          return leftDays < 30;
        });

        let jsonData = {
          logsData: {
            logs: updatedLogs,
          },
        };

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error(err, 'Error while writing logs to file');
            return;
          }
        });
      }
    });
  }
};

module.exports = {
  deleteLogs,
};
