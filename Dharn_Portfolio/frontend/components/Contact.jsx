import axios from "axios";
import { useState } from "react";

function Contact() {
  const form = {
    name: "",
    email: "",
    message: "",
  };

  const [data, setData] = useState(form);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/contact", data);

    alert("Message Sent");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" />

      <input placeholder="Email" />

      <textarea placeholder="Message" />

      <button>Send</button>
    </form>
  );
}

export default Contact;
