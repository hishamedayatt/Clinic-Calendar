import React, { useState, useEffect } from "react";
import {doctors,patients} from '../data/data'

const Clinic = () => {


    const [appointments, setAppointments] = useState({
        "2025-07-11": [{ time: "09:19", name: "Michael Brown", doctor: "Dr. Smith" }],
        "2025-07-12": [{ time: "14:22", name: "Sarah Johnson", doctor: "Dr. Brown" }],
    });

    const [filterDoctor, setFilterDoctor] = useState("");
    const [filterPatient, setFilterPatient] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [formData, setFormData] = useState({
        doctor: "",
        patient: "",
        date: "",
        time: "",
    });





    const [darkMode, setDarkMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const [year, setYear] = useState(2025);
    const [month, setMonth] = useState(6);

    const formatDate = (date) => date.toISOString().split("T")[0];
    const formatTime = (date) => date.toTimeString().slice(0, 5);
    const today = new Date();
    const todayStr = formatDate(today);
    const currentTimeStr = formatTime(today);


    const [selectedDate, setSelectedDate] = useState(todayStr);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };



    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    const handleAddAppointment = () => {
        const { date, time, patient, doctor } = formData;

        if (!date || !time || !patient || !doctor) {
            alert("All fields are required");
            return;
        }

        const newAppt = { time, name: patient, doctor };

        setAppointments((prev) => {
            const existingAppointments = prev[date] || [];

            const isDuplicate = existingAppointments.some(
                (appt) =>
                    appt.time === newAppt.time &&
                    appt.name === newAppt.name &&
                    appt.doctor === newAppt.doctor
            );

            if (isDuplicate) {
                alert("This appointment already exists.");
                return prev;
            }

            const updatedAppointments = {
                ...prev,
                [date]: [...existingAppointments, newAppt],
            };

            return updatedAppointments;
        });

        setFormData({ doctor: "", patient: "", date: "", time: "" });
        setShowModal(false);
    };


    const openEditModal = (date, idx) => {
        const appt = appointments[date][idx];
        setFormData({
            doctor: appt.doctor,
            patient: appt.name,
            date,
            time: appt.time,
        });
        setEditKey({ date, index: idx });
        setEditing(true);
        setShowModal(true);
    };

    const handleSaveEdit = () => {
        const { date, time, patient, doctor } = formData;
        if (!date || !time || !patient || !doctor) {
            alert("All fields are required");
            return;
        }

        setAppointments((prev) => {
            let updated = { ...prev };
            const oldDate = editKey.date;
            const oldIndex = editKey.index;
            const oldAppts = [...updated[oldDate]];
            oldAppts.splice(oldIndex, 1);
            if (oldAppts.length === 0) delete updated[oldDate];
            else updated[oldDate] = oldAppts;

            if (!updated[date]) updated[date] = [];
            updated[date].push({ time, name: patient, doctor });

            return updated;
        });

        setFormData({ doctor: "", patient: "", date: "", time: "" });
        setShowModal(false);
        setEditing(false);
        setEditKey(null);
    };

    const handleDelete = () => {
        if (!editKey) return;
        const { date, index } = editKey;
        setAppointments((prev) => {
            const updated = { ...prev };
            const appts = [...updated[date]];
            appts.splice(index, 1);
            if (appts.length === 0) delete updated[date];
            else updated[date] = appts;
            return updated;
        });
        setShowModal(false);
        setEditing(false);
        setEditKey(null);
    };

    const goPrevMonth = () => {
        if (month === 0) {
            setYear((y) => y - 1);
            setMonth(11);
        } else {
            setMonth((m) => m - 1);
        }
    };

    const goNextMonth = () => {
        if (month === 11) {
            setYear((y) => y + 1);
            setMonth(0);
        } else {
            setMonth((m) => m + 1);
        }
    };

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    

    
    for (let i = 0; i < firstDayIndex; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, "0")}-${i
            .toString()
            .padStart(2, "0")}`;

        const dayAppointments = (appointments[dateStr] || []).filter(
            (appt) => filterDoctor === "" || appt.doctor === filterDoctor
        );

        days.push(
            <div
                key={i}
                className={`calendar-day ${dayAppointments.length > 0 ? "has-appointment" : ""}`}
                onClick={() => dayAppointments.length > 0 && openEditModal(dateStr, 0)}
            >
                <span className="day-number">{i}</span>
                {dayAppointments.map((appt, idx) => (
                    <div
                        key={idx}
                        className="appointment"
                        onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(dateStr, idx);
                        }}
                        title={`Doctor: ${appt.doctor}`}
                    >
                        {appt.time} - {appt.name} ({appt.doctor})
                    </div>
                ))}
            </div>


        );
    }

    return (
        <div className={`calendar-container ${darkMode ? "dark" : "light"}`}>
            <div className="mobile-view">

                <div className="top-bar">
                    <button className="add-btn" onClick={() => {
                        setFormData({ doctor: "", patient: "", date: "", time: "" });
                        setShowModal(true);
                        setEditing(false);
                    }}>+ Add</button>

                    <label class="switch">
                        <input type="checkbox" id="toggle-darkmode" onClick={() => setDarkMode((prev) => !prev)} />
                        <span class="slider round"></span>
                    </label>
                </div>
                <div className="mobile-filters">
                    <select
                        value={filterDoctor}
                        onChange={(e) => setFilterDoctor(e.target.value)}
                    >
                        <option value="">All Doctors</option>
                        {doctors.map((doc) => (
                            <option key={doc} value={doc}>
                                {doc}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filterPatient}
                        onChange={(e) => setFilterPatient(e.target.value)}
                    >
                        <option value="">All Patients</option>
                        {patients.map((pat) => (
                            <option key={pat} value={pat}>
                                {pat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mobile-date-row">
                    <input
                        type="date"
                        value={selectedDate}
                        min={todayStr}
                        onChange={handleDateChange}
                        className="mobile-date"
                    />
                    <span className="mobile-date-heading">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                {/* Appointment Cards List */}
                <div className="appointments-list">
                    {(appointments[selectedDate] || [])
                        .filter((appt) => {
                            return (
                                (filterDoctor === "" || appt.doctor === filterDoctor) &&
                                (filterPatient === "" || appt.name === filterPatient)
                            );
                        })
                        .map((appt, idx) => (
                            <div key={idx} className="appt-card">
                                <div><strong>Doctor:</strong> {appt.doctor}</div>
                                <div><strong>Patient:</strong> {appt.name}</div>
                                <div><strong>Time:</strong> {appt.time}</div>
                                <div className="card-actions">
                                    <button onClick={() => openEditModal(selectedDate, idx)}>Edit</button>
                                    <button onClick={() => {
                                        if (window.confirm("Delete this appointment?")) {
                                            setEditKey({ date: selectedDate, index: idx });
                                            handleDelete();
                                        }
                                    }}>Delete</button>
                                </div>
                            </div>
                        ))}
                    {(!appointments[selectedDate] ||
                        appointments[selectedDate].filter(
                            (appt) =>
                                (filterDoctor === "" || appt.doctor === filterDoctor) &&
                                (filterPatient === "" || appt.name === filterPatient)
                        ).length === 0) && (
                            <p>No appointments for this date.</p>
                        )}
                </div>
            </div>


            {/* Header */}
            <div className="calendar-header">
                <h2 className="clinic-title">Clinic Calendar</h2>
                <div className="calendar-actions">

                    <label class="switch">
                        <input type="checkbox" id="toggle-darkmode" onClick={() => setDarkMode((prev) => !prev)} />
                        <span class="slider round"></span>
                    </label>
                    <button
                        className="add-button"
                        onClick={() => {
                            setFormData({ doctor: "", patient: "", date: "", time: "" });
                            setShowModal(true);
                            setEditing(false);
                        }}
                    >
                        + Add Appointment
                    </button>
                </div>
            </div>

            <div className="calendar-controls-row">
                <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
                    <option value="">All Doctors</option>
                    {doctors.map((doc) => (
                        <option key={doc} value={doc}>
                            {doc}
                        </option>
                    ))}
                </select>


                <div className="calendar-month-header">
                    <button onClick={goPrevMonth}>{"<"}</button>
                    <span>
                        {new Date(year, month).toLocaleString("default", {
                            month: "long",
                            year: "numeric",
                        })}
                    </span>
                    <button onClick={goNextMonth}>{">"}</button>
                </div>

                <div className="current-datetime">
                    {currentTime.toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                    })}
                </div>
            </div>

            {/* Calendar */}
            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d} className="calendar-day-name">
                        {d}
                    </div>
                ))}
                {days}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => { setShowModal(false); setEditing(false); }}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editing ? "Edit Appointment" : "Add Appointment"}</h3>
                        <label>
                            Doctor:
                            <select name="doctor" value={formData.doctor} onChange={handleInputChange}>
                                <option value="">Select</option>
                                {doctors.map((doc) => (
                                    <option key={doc} value={doc}>
                                        {doc}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Patient:
                            <select name="patient" value={formData.patient} onChange={handleInputChange}>
                                <option value="">Select</option>
                                {patients.map((pat) => (
                                    <option key={pat} value={pat}>
                                        {pat}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Date:
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                min={todayStr}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Time:
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                min={formData.date === todayStr ? currentTimeStr : undefined}
                                onChange={handleInputChange}
                            />
                        </label>
                        <div className="modal-actions">
                            {editing ? (
                                <>
                                    <button className="add-button" onClick={handleSaveEdit}>Save</button>
                                    <button className="cancel-button" onClick={() => { setShowModal(false); setEditing(false); }}>Cancel</button>
                                    <button className="cancel-button" style={{ backgroundColor: "#f87171", color: "#fff" }} onClick={() => {
                                        if (window.confirm("Delete this appointment?")) handleDelete();
                                    }}>Delete</button>
                                </>
                            ) : (
                                <>
                                    <button className="add-button" onClick={handleAddAppointment}>Add</button>
                                    <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Clinic;



