"use client";

import React, { use, useState } from "react";
import { Mail } from "@/lib/email";

export default function ErrorPage () {
    const [issue, setIssue] = useState("");
    const [body, setBody] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(true);
    const [email, setEmail] = useState("")
    const [error, setError] = useState("");

    async function handleEmailSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setLoading(true);
        const message: string = `
            <p>Dear Devs,</p>
            <p>    ${body}<p>
            <p>${email}</p>
        `

        Mail("fcdbbrainy@gmail.com", issue, message)
        .then((sent) => {setSuccess(true)})
        .catch((e) => {setError(e); setSuccess(false)})

        setLoading(false);
    }

    return(
    <div className="bg-[#ffffff]">
    <div>User not loaded. Either Invalid Cookies or Database/Internet Connection Issue</div>
    <p>please attempt at least one of the following the following</p>
    <ul>
      <li>Check Your Internet Connection</li>
      <li>Check Issues with Your Firewall or Proxy</li>
      <li>Delete/Erase Cookies</li>
    </ul>
    <p>If NONE of the above work or the error persists, please fill in the feedback form below to send it to the devs</p>
    <form onSubmit={handleEmailSubmit}>
      <input placeholder="What Issue are You Facing" value={issue}></input>
      <input placeholder="More Info On The Issue" value={body}></input>
      <input placeholder="Your Email" value={email}></input>
      <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
    </form>
    {success && <p>Yor Form Was Submitted But May Take at most 24-hours for a Response</p>}
    {error && <p>Submit Failed, Try Again or Check Your Internet Connection</p>}
    </div>
  );
}