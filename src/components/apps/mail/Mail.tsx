import { useState } from 'react';
import './Mail.css';

type Mailbox = 'Inbox' | 'Sent' | 'Drafts' | 'Archive';

// Web3Forms Access Key provided by the user
const WEB3FORMS_ACCESS_KEY = "b50ae64b-082b-4278-a7bb-d2b67eaf5582";

export function Mail() {
  const [activeMailbox, setActiveMailbox] = useState<Mailbox>('Inbox');
  
  // Compose Form State
  const [composeName, setComposeName] = useState('');
  const [composeEmail, setComposeEmail] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  
  // Sending State
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeName || !composeEmail || !composeBody) {
      setErrorMsg("Please fill in Name, Email, and Message.");
      return;
    }
    
    setIsSending(true);
    setErrorMsg('');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: composeName,
          email: composeEmail,
          subject: composeSubject || "New Contact from macOS Portfolio",
          message: composeBody,
          // Optional settings
          replyto: composeEmail,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        // Clear form
        setComposeName('');
        setComposeEmail('');
        setComposeSubject('');
        setComposeBody('');
      } else {
        setErrorMsg(result.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMsg("Failed to send email. Please check your connection.");
    } finally {
      setIsSending(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setComposeName('');
    setComposeEmail('');
    setComposeSubject('');
    setComposeBody('');
  };

  return (
    <div className="mail-app">
      {/* Sidebar - Dummy Buttons */}
      <aside className="mail-sidebar">
        <button className="mail-compose-btn" onClick={resetForm}>
          ✏️ Compose
        </button>
        <p className="mail-sidebar-header">Mailboxes</p>
        {([
          { label: 'Inbox' as Mailbox,   icon: '📥', count: 0 },
          { label: 'Sent' as Mailbox,    icon: '📤', count: 0 },
          { label: 'Drafts' as Mailbox,  icon: '📝', count: 0 },
          { label: 'Archive' as Mailbox, icon: '🗄️', count: 0 },
        ]).map(box => (
          <button
            key={box.label}
            className={`mail-mailbox-btn ${activeMailbox === box.label ? 'active' : ''}`}
            onClick={() => { setActiveMailbox(box.label); resetForm(); }}
          >
            <span>{box.icon} {box.label}</span>
          </button>
        ))}
      </aside>

      {/* Main Detail / Compose pane */}
      <div className="mail-detail">
        <div className="mail-compose-pane">
          <div className="mail-compose-header">
            <h3>Contact Me</h3>
            <div className="mail-header-actions">
              <button type="button" className="mail-discard-btn" onClick={resetForm}>Clear Form</button>
              <button type="submit" form="contact-form" className="mail-send-btn" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send ↗'}
              </button>
            </div>
          </div>
          
          {isSuccess ? (
            <div className="mail-compose-success">
              <div className="mail-success-icon">✓</div>
              <h3>Message Sent Successfully</h3>
              <p>Thanks for reaching out. I'll get back to you soon!</p>
              <button className="mail-success-btn" onClick={resetForm}>Send Another Message</button>
            </div>
          ) : (
            <form id="contact-form" className="mail-compose-form" onSubmit={handleSendEmail}>
              <div className="mail-compose-field">
                <label>Name:</label>
                <input required value={composeName} onChange={e => setComposeName(e.target.value)} placeholder="Your Name" />
              </div>
              <div className="mail-compose-field">
                <label>Email:</label>
                <input required type="email" value={composeEmail} onChange={e => setComposeEmail(e.target.value)} placeholder="your@email.com" />
              </div>
              <div className="mail-compose-field">
                <label>Subject:</label>
                <input value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject" />
              </div>
              
              <div className="mail-compose-body-container">
                <textarea
                  required
                  className="mail-compose-body"
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)}
                  placeholder="Write your message here…"
                />
              </div>
              
              {errorMsg && <div className="mail-compose-error">{errorMsg}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
