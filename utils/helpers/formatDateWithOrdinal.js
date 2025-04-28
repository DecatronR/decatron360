import { Text } from "@react-pdf/renderer";

const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatDateWithOrdinal = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  const month = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();

  return (
    <Text>
      {day}
      <Text style={{ fontSize: 8, verticalAlign: "super" }}>
        {ordinalSuffix}
      </Text>{" "}
      {month} {year}
    </Text>
  );
};
