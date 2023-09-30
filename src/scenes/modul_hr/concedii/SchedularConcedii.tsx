import React, { useEffect } from "react";
import "dhtmlx-scheduler";
import "dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css";

const Scheduler: React.FC = () => {
  useEffect(() => {
    const scheduler = (window as any).scheduler;
    scheduler.config.xml_date = "%Y-%m-%d %H:%i";
    scheduler.config.edit_on_create = true;
    scheduler.config.drag_create = false; // Disable event creation by dragging
    scheduler.config.drag_move = false; // Disable event dragging
    scheduler.config.drag_resize = false; // Disable event resizing

    // Configure the available views (only the month view)
    scheduler.views = [
      {
        name: "month",
        label: "Month",
        maxDate: new Date(9999, 12, 31),
      },
    ];

    scheduler.init("scheduler_here", new Date(), "month");

    // Sample event data with status (request/approved)
    const eventsData = [
      {
        id: 1,
        text: "Event 1",
        start_date: "2023-09-01 09:00",
        end_date: "2023-09-02 10:00",
        status: "request", // Initially set as a request
      },
      {
        id: 2,
        text: "Event 2",
        start_date: "2023-09-10 14:00",
        end_date: "2023-09-11 15:30",
        status: "approved", // Initially set as approved
      },
      // Add more events as needed
    ];

    scheduler.parse(eventsData);

    console.log(scheduler.getEvent(1).status);
    console.log(scheduler.templates.event_class);

    scheduler.attachEvent("onBeforeLightbox", (id: any) => {
      if (id) {
        // Existing event, hide the "Save" and "Delete" buttons
        scheduler.config.buttons_left = ["dhx_cancel_btn"];
        scheduler.config.buttons_right = [];
      } else {
        // New event, show the default buttons
        scheduler.config.buttons_left = ["dhx_save_btn", "dhx_cancel_btn"];
        scheduler.config.buttons_right = ["dhx_delete_btn"];
      }
      return true;
    });

    scheduler.templates.event_class = function (ev: any) {
      if (ev.status === "request") {
        // Apply a different style for requested events
        return "requested-event";
      } else if (ev.status === "approved") {
        // Apply a style for approved events
        return "approved-event";
      }
      // Default style for other events
      return "";
    };

    return () => {
      scheduler.clearAll();
    };
  }, []);

  // Add CSS to hide the view switch buttons
  useEffect(() => {
    const hideViewSwitchButtons = () => {
      const viewSwitchButtons = document.querySelectorAll(
        ".dhx_cal_tab"
      ) as NodeListOf<HTMLElement>;

      viewSwitchButtons.forEach((button) => {
        button.style.display = "none";
      });
    };

    hideViewSwitchButtons();

    // Listen for window resize events and hide the buttons again if necessary
    window.addEventListener("resize", hideViewSwitchButtons);

    return () => {
      window.removeEventListener("resize", hideViewSwitchButtons);
    };
  }, []);

  return (
    <div id="scheduler_here" style={{ width: "100%", height: "600px" }}></div>
  );
};

export default Scheduler;
