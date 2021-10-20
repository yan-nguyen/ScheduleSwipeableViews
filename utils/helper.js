/* eslint-disable import/no-anonymous-default-export */
import _get from "lodash/get";
import _forEach from "lodash/forEach";
import _isArray from "lodash/isArray";
import _isEmpty from "lodash/isEmpty";
import moment from "moment";
import "moment/locale/ja";

moment.locale("ja");

export default {
  formatDate: (date, formatString) => moment(date).format(formatString),
  getMonthValues: () => {
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];
    return months.map((month) => ({
      value: month,
      name: month,
    }));
  },
  getYearValues: (from, to) => {
    const values = [];
    for (let i = from; i <= to; i += 1) {
      values.push({
        value: i,
        name: i,
      });
    }
    return values;
  },
  addCommaToString: (value) => {
    if (["number", "string"].indexOf(typeof value) < 0) {
      return "";
    }
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },
  formatTime: (values, formatString) =>
    moment(values, "Hmm").format(formatString),
};
