"use client";
import { useRouter } from 'next/navigation';
import LogoutForm from '@/components/auth-modules/logout/LogoutForm';
import React, { useState, useEffect } from 'react';

type UserData = {
  user_first_name: string;
};
export default function Home() {
  const router = useRouter();
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const checkSession = async() => {
          try{
              console.log("Checking session status...");
              const response = await fetch("http://127.0.0.1:80/session-check", {
                  method: "GET",
                  headers:{"Content-Type": "application/json"},
                  credentials:"include",
              });
              const data = await response.json();
              console.log("Session check data:", data);
              // if (data.redirect){
              //     router.push("/");
              // TODO: maybe make a session valid check
              // so, i only fetch user data when session is valid
              // }
              if (!data.redirect){
                  router.push("/login");
              }
              

          } catch (err) {
              console.error("Error during session check:", err);
          }
      };
      checkSession();

  },[])

  useEffect(() => {
  fetch("http://127.0.0.1:80/user-data",{
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
 
  // TODO: improve loading, so there is no glimps of content before redirect
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
