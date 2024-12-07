import { createClient } from '@supabase/supabase-js'
import { Database } from '../Types/supabase'


const supabaseUrl = 'https://fuxmqpbffwqxdyvwrbgd.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eG1xcGJmZndxeGR5dndyYmdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMDc1MTEsImV4cCI6MjA0ODY4MzUxMX0.DVwnySnUxuCEAyGwGJ_u-XLKuOER6d8uO1EQWR5ZQEs"


export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)

/*
const supabaseUrl = 'https://miufdqzfqrbtwsnuvbkt.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdWZkcXpmcXJidHdzbnV2Ymt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5MjY3NDAsImV4cCI6MjAxOTUwMjc0MH0.y0ozGqPgQiUQuLYkVemLOr6C_xIDsOCAPAyjfr4eYUs"

*/

/*
const supabaseUrl = 'https://kvllqttkeseeojuwvcnw.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bGxxdHRrZXNlZW9qdXd2Y253Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2MTQ3NTgsImV4cCI6MjAzODE5MDc1OH0.faTCBEOh2e7gFvbr6DTALBQT42q-P331Cw1yledrS-0"
*/