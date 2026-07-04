const contactNotification = ({ name, email, subject, message }) => {
  return `

<h2>New Portfolio Message</h2>

<p><strong>Name:</strong> ${name}</p>

<p><strong>Email:</strong> ${email}</p>

<p><strong>Subject:</strong> ${subject}</p>

<p>${message}</p>

`;
};

module.exports = contactNotification;
