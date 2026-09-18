/**
 * 
 * @param {String} time DateTime String to be converted <YYYY-MM-DDTHH:SSZ> / <YYYY-MM-DD HH:SS>
 * @param {Boolean} iso Convert the time to an ISO8601 UTC String
 * @param {String} tz Timezone name to convert the time to.
 * @returns 
 */
export function FormatTime({
    time,
    iso = false,
    tz = ''
}) {

    if( ! time ) {
        return time;
    }




    // credit https://stackoverflow.com/a/74800084
    Date.prototype.format = function(formatString) {

        const calMonths = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        return Object.entries({
            YYYY: this.getFullYear(),
            YY: this.getFullYear().toString().substring(2),
            yyyy: this.getFullYear(),
            yy: this.getFullYear().toString().substring(2),
            // `D` must be before month, as Dec with be processed as `#ec`
            DDDD: this.toLocaleDateString('default', { weekday: 'long'  }),
            DDD: this.toLocaleDateString('default',  { weekday: 'short' }),
            DD: this.getDate().toString().padStart(2, '0'),
            D: this.getDate(),
            dddd: this.toLocaleDateString('default', { weekday: 'long'  }),
            ddd: this.toLocaleDateString('default',  { weekday: 'short' }),
            dd: this.getDate().toString().padStart(2, '0'),
            d: this.getDate(),
            // `S` must be before month, as Sep with be processed as `#ep`
            SS: this.getSeconds().toString().padStart(2, '0'),
            S: this.getSeconds(),
            ss: this.getSeconds().toString().padStart(2, '0'),
            s: this.getSeconds(),
            MMMM: String(calMonths[this.getMonth()]),
            MMM: String(calMonths[this.getMonth()]).substring(0,3),
            MM: (this.getMonth() + 1).toString().padStart(2, '0'),
            // M: this.getMonth() + 1,
            HH: this.getHours().toString().padStart(2, '0'), // military
            H: this.getHours().toString(), // military
            hh: (this.getHours() % 12).toString().padStart(2, '0'),
            h: (this.getHours() % 12).toString(),
            mm: this.getMinutes().toString().padStart(2, '0'),
            m: this.getMinutes(),
            TTT: this.getMilliseconds().toString().padStart(3, '0'),
            ttt: this.getMilliseconds().toString().padStart(3, '0'),
            AMPM: this.getHours() < 13 ? 'AM' : 'PM',
            ampm: this.getHours() < 13 ? 'am' : 'pm',
        }).reduce((acc, entry) => {
            return acc.replace(entry[0], entry[1].toString())
        }, formatString)
        }

        const now = new Date();

        const tz_offset_minutes = now.getTimezoneOffset()

        const actual_timezone_offset = tz_offset_minutes * 60


        let user_timezone_hour
        let user_timezone_minute
        let user_timezone_direction
        let user_timezone_offset
        let user_timezone

        if( tz ) {

            const date = new Date();
            const get_timezone = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            timeZoneName: 'longOffset'
            }).format(date).split('GMT');

            if( get_timezone[1] ) {

                user_timezone = get_timezone[1]

            } else {

                user_timezone = '+00:00'
            }


            user_timezone_hour = Number(user_timezone.replace('+', '').replace('-', '').split(':')[0])
            user_timezone_minute = Number(user_timezone.replace('+', '').replace('-', '').split(':')[1])

            user_timezone_direction = String(String(user_timezone).startsWith('-') ? '-' : '')

            user_timezone_offset = Number(user_timezone_direction + String((user_timezone_hour * 60 * 60) + (user_timezone_minute * 60)))

        }

        let calculation_offset = 0


        if(    // Add TZ to input field of type `datetime-local` to user specified TZ
            ! String(time).endsWith('Z')
            &&
            ! /[+|-]+\d{2}\:\d{2}/i.test(time)
        ) {

            time = time + user_timezone

        }


        calculation_offset = (actual_timezone_offset ) + ( actual_timezone_offset + user_timezone_offset )

        const tester = new Date(String(time))


        let datetime = tester

        if( calculation_offset !== 0 ) {

            datetime = new Date(tester.setTime(tester.getTime() + Number(
                (user_timezone_offset + actual_timezone_offset) * 1000
            )))

        }

    const value = iso ? datetime.toISOString().replace(/(\.\d+)Z/, 'Z') : datetime.format('HH:mm DD MMM YYYY')

    return String( value );
}
