/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable-next-line array-callback-return */
import { useEffect, useState } from "react";
import moment from "moment";
import clsx from "clsx";
import SwipeableViews from "react-swipeable-views";
import _get from "lodash/get";
import _find from "lodash/find";
import _indexOf from "lodash/indexOf";
import Button from "@mui/material/Button";
import Helper from "../../utils/helper";
import styles from '../../styles/Home.module.css'

const DEFAULT_ITEM_PER_PAGE = 7;

const ModuleDay = ({ rangeSlots = {}, title, dataSlots, handleClick }) => (
  <div className={styles.moduleDay}>
    <div
      className={clsx(styles.moduleDayTitle, {
        blue: moment(title).format("ddd") === "Sat",
        pink: moment(title).format("ddd") === "Sun",
      })}
    >
      {`${title.slice(-2)}
        ${moment(title).format("ddd")}`}
    </div>
    <div className={styles.moduleDaySlots}>
      {Object.keys(rangeSlots).length > 0 &&
        Object.keys(rangeSlots).map((key) =>
          _get(dataSlots, `${key}`, true) ? (
            <div key={key} className={clsx(styles.moduleHour, styles.notAvailable)}>
              X
            </div>
          ) : (
            <div key={key} className={clsx(styles.moduleHour, styles.available)}>
              <Button
                onClick={() =>
                  handleClick({
                    slot: key,
                    bookingDatetime: title,
                  })
                }
              >
                O
              </Button>
            </div>
          )
        )}
    </div>
  </div>
);

function getDefaultRangeSlotTimes(startTime, endTime) {
  const slotResults = {};
  for (
    let start = Math.ceil(Number(startTime) / 100);
    start <= Number(endTime) / 100;
    start += 1
  ) {
    slotResults[start * 100] = true;
    if (start * 100 + 30 <= Number(endTime)) {
      slotResults[start * 100 + 30] = true;
    }
  }
  if (Number(startTime) / 100 < Math.ceil(Number(startTime) / 100)) {
    slotResults[Number(startTime)] = true;
  }
  return slotResults;
}

const Timetable = ({
  maxDay,
  startDate,
  dataAvailable = [],
  initialDate,
  changeDate,
  selectDatetimeBooking,
  openCloseTime,
}) => {
  const [totalPage, setTotalPage] = useState(1);
  const [firstDate, setFirstData] = useState(startDate);
  const [currentPage, setCurrentPage] = useState(1);
  const [rangeDate, setRangeDate] = useState([]);
  const [rangeSwipeViews, setRangeSwipeViews] = useState([]);
  const rangeSlots = getDefaultRangeSlotTimes(
    openCloseTime.openTime,
    openCloseTime.closeTime
  );

  useEffect(() => {
    // Logic for displaying moduleDay column
    const currentRangeDate = [];
    const currentRangeSwipeViews = [];
    let currentArr = [];
    const diffStartDate = moment(startDate).day() - 1;
    const currentTotalPage = Math.ceil(
      (maxDay + diffStartDate) / DEFAULT_ITEM_PER_PAGE
    );
    for (
      let d = moment(startDate).subtract(diffStartDate, "days");
      d.isBefore(
        moment(startDate)
          .add(currentTotalPage * DEFAULT_ITEM_PER_PAGE + diffStartDate, "days")
          .toString()
      );
      d.add(1, "days")
    ) {
      currentRangeDate.push(Helper.formatDate(d, "YYYY-MM-DD").toString());
      currentArr.push(Helper.formatDate(d, "YYYY-MM-DD").toString());
      if (currentArr.length === DEFAULT_ITEM_PER_PAGE) {
        currentRangeSwipeViews.push(currentArr);
        currentArr = [];
      }
    }

    setTotalPage(currentTotalPage);
    setRangeDate(currentRangeDate);
    setRangeSwipeViews(currentRangeSwipeViews);
  }, [maxDay, startDate, dataAvailable]);

  useEffect(() => {
    const indexDate = _indexOf(
      rangeDate,
      Helper.formatDate(initialDate, "YYYY-MM-DD").toString()
    );
    setCurrentPage(Math.floor(indexDate / DEFAULT_ITEM_PER_PAGE) + 1);
  }, [initialDate, rangeDate]);

  const changeDateMethod = (type = "add") => {
    let chooseDate = moment();
    if (type === "add") {
      const currentItem = moment(dataAvailable[dataAvailable.length - 1].date);
      chooseDate = moment(initialDate).add(7, "days");

      if (currentPage + 1 === totalPage && chooseDate.isAfter(currentItem)) {
        chooseDate = currentItem;
      }
    }
    if (type === "subtract") {
      // console.log("initialDate: ", initialDate);
      chooseDate = moment(initialDate).subtract(7, "days");
    }
    changeDate(new Date(chooseDate));
  };

  const nextMethod = () => {
    if (currentPage + 1 <= totalPage) {
      setCurrentPage(currentPage + 1);
      setFirstData(rangeSwipeViews[currentPage][0]);
      changeDateMethod("add");
    }
  };

  const previousMethod = () => {
    if (currentPage - 1 > 0) {
      setCurrentPage(currentPage - 1);
      if (currentPage - 2 > 0) {
        setFirstData(rangeSwipeViews[currentPage - 2][0]);
      } else {
        setFirstData(rangeSwipeViews[0][0]);
      }
      changeDateMethod("subtract");
    }
  };

  const handleChangeIndex = (index) => {
    if (index === currentPage) {
      changeDateMethod("add");
    } else {
      changeDateMethod("subtract");
    }
    setCurrentPage(index + 1);
    setFirstData(rangeSwipeViews[index][0]);
  };

  return (
    <div className="calendar-timeline-wrapper">
      <div className={styles.timetableToolbar}>
        <Button
          className="btn-prev"
          disabled={currentPage === 1}
          onClick={previousMethod}
        >
          <i className="icon-angle-left" />
          <span>前の週へ</span>
        </Button>
        <div className="text-month">{Helper.formatDate(firstDate, "M月")}</div>
        <Button
          className="btn-next"
          disabled={currentPage === totalPage}
          onClick={nextMethod}
        >
          <span>次の週へ</span>
          <i className="icon-angle-right" />
        </Button>
      </div>
      <div className={styles.timetableWrapper}>
        <div className={clsx(styles.moduleDay, styles.headerRoot)}>
          <div className={styles.moduleDayTitle}>日時</div>
          <div className={styles.moduleDaySlots}>
            <div className="t-scroll">
              {Object.keys(rangeSlots).length > 0 &&
                Object.keys(rangeSlots).map((key) => (
                  <div key={key} className={styles.moduleHour}>
                    {Helper.formatTime(
                      key.toString().padStart(4, "0"),
                      "HH:mm"
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className={styles.timetableOuter}>
          <div className={styles.outerDay}>
            {rangeSwipeViews.length > 0 && (
              <SwipeableViews
                index={currentPage - 1 >= 0 ? currentPage - 1 : currentPage}
                enableMouseEvents
                onChangeIndex={handleChangeIndex}
              >
                {rangeSwipeViews.map((swipeItem) => (
                  <div key={swipeItem} className={styles.innerOuterDay}>
                    {swipeItem.length > 0 &&
                      swipeItem.map((itemDate) => (
                        <ModuleDay
                          key={itemDate}
                          rangeSlots={rangeSlots}
                          title={itemDate}
                          dataSlots={_get(
                            _find(dataAvailable, ["date", itemDate]),
                            "slots"
                          )}
                          handleClick={selectDatetimeBooking}
                        />
                      ))}
                  </div>
                ))}
              </SwipeableViews>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
