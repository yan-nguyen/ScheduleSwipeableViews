import Head from 'next/head'
import Image from 'next/image'
import Timetable from '../components/Timetable'
import styles from '../styles/Home.module.css'
import { START_DATE, availableTimeByDay, maxBookingDay, calendarDate, openCloseTime } from '../utils/constants'
import _get from "lodash/get";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Schedule with swipeable views</title>
        <meta name="description" content="Schedule with swipeable views" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.timetableContainer}>
          <Timetable
            dataAvailable={availableTimeByDay}
            startDate={_get(availableTimeByDay, "[0].date") || START_DATE}
            maxDay={maxBookingDay}
            initialDate={calendarDate}
            changeDate={(value) => console.log("change date: ", value)}
            selectDatetimeBooking={(value) => console.log("select date: ", value)}
            openCloseTime={openCloseTime}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
