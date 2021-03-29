(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.monthCalendarSelect = factory());
}(this, (function () { 'use strict';

  function getEventTarget(event) {
      try {
          if (typeof event.composedPath === "function") {
              var path = event.composedPath();
              return path[0];
          }
          return event.target;
      }
      catch (error) {
          return event.target;
      }
  }

  function monthCalendarSelectPlugin() {
      return function (fp) {
          function onDayHover(event) {
              var day = getEventTarget(event);
              if (!day.classList.contains("flatpickr-day"))
                  return;
              var days = fp.days.childNodes;
              var dateObj = day.dateObj;
              var monthStartDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
              var monthEndDay = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 0);
              for (var i = days.length; i--;) {
                  var day_1 = days[i];
                  var date = day_1.dateObj;
                  if (date > monthEndDay || date < monthStartDay)
                      day_1.classList.remove("inRange");
                  else
                      day_1.classList.add("inRange");
              }
          }
          function highlightMonthCalendar() {
              var selDate = fp.latestSelectedDateObj;
              if (selDate !== undefined &&
                  selDate.getMonth() === fp.currentMonth &&
                  selDate.getFullYear() === fp.currentYear) {
                  fp.monthCalendarStartDay = new Date(selDate.getFullYear(), selDate.getMonth(), 1);
                  fp.monthCalendarEndDay = new Date(selDate.getFullYear(), selDate.getMonth() + 1, 0);
              }
              var days = fp.days.childNodes;
              for (var i = days.length; i--;) {
                  var date = days[i].dateObj;
                  if (date >= fp.monthCalendarStartDay && date <= fp.monthCalendarEndDay)
                      days[i].classList.add("monthCalendar", "selected");
              }
          }
          function clearHover() {
              var days = fp.days.childNodes;
              for (var i = days.length; i--;)
                  days[i].classList.remove("inRange");
          }
          function onReady() {
              if (fp.daysContainer !== undefined)
                  fp.daysContainer.addEventListener("mouseover", onDayHover);
          }
          function onDestroy() {
              if (fp.daysContainer !== undefined)
                  fp.daysContainer.removeEventListener("mouseover", onDayHover);
          }
          return {
              onValueUpdate: highlightMonthCalendar,
              onMonthChange: highlightMonthCalendar,
              onYearChange: highlightMonthCalendar,
              onOpen: highlightMonthCalendar,
              onClose: clearHover,
              onParseConfig: function () {
                  fp.config.mode = "single";
                  fp.config.enableTime = false;
                  fp.config.dateFormat = fp.config.dateFormat
                      ? fp.config.dateFormat
                      : "\\W\\e\\e\\k #W, Y";
                  fp.config.altFormat = fp.config.altFormat
                      ? fp.config.altFormat
                      : "\\W\\e\\e\\k #W, Y";
              },
              onReady: [
                  onReady,
                  highlightMonthCalendar,
                  function () {
                      fp.loadedPlugins.push("monthCalendarSelect");
                  },
              ],
              onDestroy: onDestroy,
          };
      };
  }

  return monthCalendarSelectPlugin;

})));
//# sourceMappingURL=monthCalendarSelect.js.map
