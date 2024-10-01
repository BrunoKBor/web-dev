import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

// 1. Use the inquirer npm package to get user input.
inquirer
  .prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Enter the URL to generate QR code:',
    }
  ])
  .then((answers) => {
    const url = answers.url;
    // 2. Use the qr-image npm package to turn the user entered URL into a QR code image.
    const qr_svg = qr.image(url, { type: 'png' });
    const qrFileName = 'qr_code.png';
    qr_svg.pipe(fs.createWriteStream(qrFileName));

    console.log(`QR code generated and saved as ${qrFileName}`);

    // 3. Create a txt file to save the user input using the native fs node module.
    const txtFileName = 'user_input.txt';
    fs.writeFile(txtFileName, `User entered URL: ${url}`, (err) => {
      if (err) {
        console.error('Error saving user input to file:', err);
      } else {
        console.log(`User input saved to ${txtFileName}`);
      }
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error('Prompt couldn\'t be rendered in the current environment');
    } else {
      console.error('Something else went wrong:', error);
    }
  });
