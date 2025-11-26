"use client";
import LogoutForm from '@/components/auth-modules/logout/LogoutForm';
import React, { useState, useEffect } from 'react';
import './globals.css';
type UserData = {
  user_first_name: string;
};
export default function Home() {


  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch("http://127.0.0.1/user-data",{
    method: "GET",
    headers:{"Content-Type": "application/json"},
    credentials: "include",
  })
    .then(res => res.json())
    .then(json => {
      console.log("json text",json);   
      setData(json);
           
      setLoading(false);     
    })
    .catch(err => {
      console.error("Error like what", err);
      setLoading(false);
    });
}, []);
 
    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data received</p>;
  return (
      <div>
      <h1>Data from Flask:</h1>
      <p>{JSON.stringify(data.user_first_name)}</p>
      <p>pls = {data.user_first_name}</p>
      <LogoutForm></LogoutForm>
    </div>
  );
}
