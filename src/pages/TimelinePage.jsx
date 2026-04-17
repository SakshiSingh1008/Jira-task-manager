import React, { useState, useRef, useEffect } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  addDays,
  differenceInDays,
  isEqual,
} from "date-fns";

const TimelinePage = ({ tasks }) => {
  const containerRef = useRef();
  const [hoverDate, setHoverDate] = useState(null);
  const [timelineWidth, setTimelineWidth] = useState(0);
  const [mode, setMode] = useState("months");

  const minStart = tasks.reduce(
    (min, task) =>
      new Date(task.startDate) < min ? new Date(task.startDate) : min,
    new Date()
  );
  const maxEnd = tasks.reduce(
    (max, task) =>
      new Date(task.dueDate) > max ? new Date(task.dueDate) : max,
    new Date()
  );

  const timelineStart = startOfMonth(minStart);
  const timelineEnd = endOfMonth(maxEnd);
  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1;

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setTimelineWidth(containerRef.current.offsetWidth - 250);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const getColumns = () => {
    const columns = [];
    if (mode === "months") {
      let curr = new Date(timelineStart);
      while (curr <= timelineEnd) {
        columns.push({
          label: format(curr, "MMM yyyy"),
          days: new Date(curr.getFullYear(), curr.getMonth() + 1, 0).getDate(),
        });
        curr = new Date(curr.getFullYear(), curr.getMonth() + 1, 1);
      }
    } else if (mode === "weeks") {
      let curr = new Date(timelineStart);
      while (curr <= timelineEnd) {
        columns.push({
          label: `Wk ${format(curr, "w")}`,
          days: 7,
        });
        curr = addDays(curr, 7);
      }
    } else if (mode === "quarters") {
      let curr = new Date(timelineStart);
      while (curr <= timelineEnd) {
        columns.push({
          label: `Q${Math.floor(curr.getMonth() / 3) + 1} ${curr.getFullYear()}`,
          days: 90,
        });
        curr = addDays(curr, 90);
      }
    }
    return columns;
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const containerLeft = containerRef.current.getBoundingClientRect().left;
    const x = e.clientX - containerLeft - 250;
    if (x < 0 || x > timelineWidth) {
      setHoverDate(null);
      return;
    }
    const dayWidth = timelineWidth / totalDays;
    const dayOffset = Math.floor(x / dayWidth);
    const date = addDays(timelineStart, dayOffset);
    setHoverDate(date);
  };

  const handleMouseLeave = () => setHoverDate(null);

  const positionForDate = (date) =>
    ((differenceInDays(date, timelineStart) / totalDays) * 100);

  return (
    <div className="h-screen bg-white p-6 overflow-hidden flex flex-col text-lg" style={{fontSize: '1.15rem'}}>
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Timeline</h1>
        <div className="flex gap-2 text-base">
          <button onClick={() => setMode("months")} className={`px-4 py-1.5 rounded ${mode === "months" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Months</button>
          <button onClick={() => setMode("weeks")} className={`px-4 py-1.5 rounded ${mode === "weeks" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Weeks</button>
          <button onClick={() => setMode("quarters")} className={`px-4 py-1.5 rounded ${mode === "quarters" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Quarters</button>
        </div>
      </div>

      {/* Timeline */}
      <div
        ref={containerRef}
        className="relative flex-1 border-t border-gray-200 w-full"
        style={{ overflowX: "hidden" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div style={{ width: "100%" }}>
          {/* Header Row */}
          <div className="flex border-b border-gray-300 w-full" style={{ width: "100%" }}>
            <div className="w-[250px]" />
            {getColumns().map((col, idx) => (
              <div
                key={idx}
                className="text-base text-gray-700 text-center border-r border-gray-200 font-semibold"
                style={{ width: `${(col.days / totalDays) * 100}%` }}
              >
                {col.label}
              </div>
            ))}
          </div>

          {/* Task Rows */}
          {tasks.map((task) => {
            const start = parseISO(task.startDate);
            const end = parseISO(task.dueDate);
            const startOffset = differenceInDays(start, timelineStart);
            const span = differenceInDays(end, start) + 1;

            const left = positionForDate(start);
            const width = ((span / totalDays) * 100);

            let vBarLeft = null;
            if (hoverDate) vBarLeft = positionForDate(hoverDate);

            const showStartLabel = hoverDate && isEqual(hoverDate, start);
            const showEndLabel = hoverDate && isEqual(hoverDate, end);

            return (
              <div key={task.id} className="flex items-center border-b border-gray-100 h-16 w-full">
                {/* Summary */}
                <div className="w-[250px] pr-4">
                  <div className="font-semibold text-lg text-gray-900 truncate">{task.title}</div>
                  <div className="text-base text-gray-500 truncate">{task.summary}</div>
                </div>
                {/* Timeline Bar */}
                <div className="relative flex-1 h-full">
                  <div
                    className="absolute top-4 h-8 bg-blue-600 text-white text-base px-4 rounded flex items-center font-semibold"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      minWidth: "60px",
                      fontSize: "1.1rem"
                    }}
                  >
                    {task.title}
                  </div>
                  {/* Vertical Line for every task */}
                  {hoverDate && (
                    <>
                      <div
                        className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
                        style={{ left: `${vBarLeft}%` }}
                      />
                      {(showStartLabel || showEndLabel) && (
                        <div
                          className="absolute top-0 text-base text-red-700 bg-white px-3 py-1 border border-red-500 rounded shadow z-20 font-bold"
                          style={{
                            left: `${vBarLeft}%`,
                            transform: "translateX(-50%)",
                            fontSize: "1rem"
                          }}
                        >
                          {showStartLabel
                            ? format(start, "dd MMM yyyy")
                            : format(end, "dd MMM yyyy")}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;;


































