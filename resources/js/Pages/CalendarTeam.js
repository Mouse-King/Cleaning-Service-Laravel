import React from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'

export default function CalendarTeam() {
    
  return (
    <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, resourceTimeGridPlugin ]}
        initialView = 'resourceTimeGridDay'
        resources =  {[
            { id: 'a', title: 'Sohrab' },
            { id: 'b', title: 'Hasan'},
            { id: 'c', title: 'Danish' },
            { id: 'd', title: 'Fateh' },
            { id: 'e', title: 'Kulwinder' },
            { id: 'f', title: 'Prashant' },
            { id: 'g', title: 'Ganesh' },
            { id: 'H', title: 'Krishna' },
            { id: 'I', title: 'Avinash' }
        ]}
        
        events={'https://fullcalendar.io/api/demo-feeds/events.json?with-resources=4&single-day'}
    />
  )
}
