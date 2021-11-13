// Import package
import React from "react";

// Import asset
import default_profile from "../../assets/img/blank-profile.png";

// Import stylesheet
import "../../stylesheets/Complain.css";

export default function Contact({ dataContact, clickContact, contact }) {
  return (
    <>
      {dataContact.length > 0 && (
        <>
          {dataContact.map((item) => (
            <div
              key={item.id}
              className={`contact mt-3 p-2 ${contact?.id === item?.id && "contact-active"}`}
              onClick={() => {
                clickContact(item);
              }}
            >
              <img src={item.photo_profile || default_profile} className="rounded-circle me-2 img-contact" alt="user avatar" />
              <div className="pt-2">
                <ul className="ps-0 text-contact">
                  <li>{item.full_name}</li>
                  <li className="text-contact-chat mt-1">{item.message}</li>
                </ul>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
}
