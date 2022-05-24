const { app, ipcMain, BrowserWindow } = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')
const sqlite3 = require('sqlite3');

require('@electron/remote/main').initialize()

// Initializing a new database
const db = new sqlite3.Database(
  isDev
    ? path.join(__dirname, '../db/dev.db') // my root folder if in dev mode
    : path.join(app.getPath("userData"), "pro.db"), // the resources path if in production build
  (err) => {
    if (err) {
      console.log(`Database Error: ${err}`);
    } else {
      console.log('Database Loaded');
    }
  }
);

// REQUEST AND GET ALL EVENT
ipcMain.on('request-all-event', async (event, args) => {
  db.all(`SELECT * FROM events WHERE event_id != 0 ORDER BY event_id DESC`, (err, data) => {
    if(err) console.log(err.message);
    if(data.length != 0) event.sender.send('get-all-event', data);
  })
})

// SET CURRENT EVENT
ipcMain.handle('set-current-event', (event, args) =>{
  db.run(`UPDATE events SET isCurrent="N"`, (err, data) => {if(err) return err.message;})
  db.run(`UPDATE events SET isCurrent="Y" WHERE event_id=${args.event_id}`, (err, data) => {if(err) return err.message;})
  return "Current Event is set";
})

// Create Event
ipcMain.handle('create-event', (event, args) =>{
  db.run(`UPDATE events SET isCurrent="N"`, (err, data) => {if(err) return err.message;})
  db.run(`INSERT INTO events (event_name, isCurrent) VALUES("${args.event_name}","Y")`, (err, data) =>{if(err) return err.message;})
  return "New Event Created!";
})

// Delete Event
ipcMain.handle('delete-event', (event, args) =>{
  db.run(`DELETE FROM events WHERE event_id=${args.event_id}`, (err, data) =>{ if(err) return err.message; })
  return "Event Deleted!";
})

// REQUEST AND GET ALL CHURCH
ipcMain.on('request-all-church', async (event, args) => {
  db.all(`SELECT * FROM church ORDER BY c_id ASC`, (err, data) => {
    if(err) console.log(err.message);
    event.sender.send('get-all-church', data);
  })
})

// Add Church
ipcMain.handle('add-church', (event, args) =>{
  db.run(`INSERT INTO church (church_name, isHidden) VALUES("${args.church_name}","Y")`, (err, data) =>{if(err) return err.message;})
  return "New Church Created!";
})

// Delete Event
ipcMain.handle('delete-church', (event, args) =>{
  console.log(args);
  db.run(`DELETE FROM church WHERE c_id IN (${args.c_id})`, (err, data) =>{ if(err) return err.message; })
  return "Church Deleted!";
})

// REQUEST AND GET ALL Sleeping Area
ipcMain.on('request-all-sleeping_area', async (event, args) => {
  db.all(`SELECT * FROM sleeping_area Order By s_id ASC`, (err, data) => {
    if(err) console.log(err.message);
    event.sender.send('get-all-sleeping_area', data);
  })
})

// Add Sleeping Area
ipcMain.handle('add-sleeping_area', (event, args) =>{
  db.run(`INSERT INTO sleeping_area (kor_sleeping_area, eng_sleeping_area, isHidden) VALUES("${args.kor_sleeping_area}","${args.eng_sleeping_area}","Y")`, (err, data) =>{if(err) return err.message;})
  return "New Sleeping_Area Created!";
})

// Delete Sleeping Area
ipcMain.handle('delete-sleeping_area', (event, args) =>{
  db.run(`DELETE FROM sleeping_area WHERE s_id IN (${args.s_id})`, (err, data) =>{ if(err) return err.message; })
  return "Sleeping_Area Deleted!";
})

// REQUEST AND GET CURRENT PARTICIPANTS w/ events
ipcMain.on('request-current-participants', async (event, args) => {
  db.all(`SELECT *, (SELECT b.event_name FROM events b WHERE b.event_id=a.event_id) AS event_name
   FROM participants a
   WHERE a.event_id = (SELECT event_id from events where isCurrent="Y") 
   ORDER BY church, eng_name, kor_name`, (err, data) => {
    if(err) console.log(err.message);
    else event.sender.send('get-current-participants', data);
  })
})

// Add Participant
ipcMain.handle('add-participant', (event, args) =>{
  db.run(`INSERT INTO participants (event_id, barcode, kor_name, eng_name, church, group_name, is_guest,
    kor_sleeping_area, eng_sleeping_area, gender, fee, speak_korean, speak_english, speak_spanish, speak_chinese,
    is_checked_in, is_fee_paid, remark) 
    VALUES((SELECT event_id FROM events WHERE isCurrent="Y"),(SELECT PRINTF('%06d',IFNULL(Max(p_id)+1,1)) FROM participants),
    "${args.kor_name}", "${args.eng_name}", "${args.church}", "${args.group_name}", "${args.is_guest}",
    "${args.kor_sleeping_area}", "${args.eng_sleeping_area}","${args.gender}",${args.fee},"${args.speak_korean}",
    "${args.speak_english}","${args.speak_spanish}","${args.speak_chinese}","${args.is_checked_in}","${args.is_fee_paid}",
    "${args.remark}")`, 
    (err, data) =>{if(err){return err.message;} })
  return "New Participant Created!";
})

// Add Many Participant
ipcMain.handle('add-many-participants', (event, args) =>{
  const rowData = args.rowData;
  db.serialize(function(){
    db.exec('BEGIN TRANSACTION');
    for(let i=0;i<rowData.length;i++){
      //console.log(rowData[i]);
      const row = rowData[i];
      db.run(`INSERT INTO participants (event_id, barcode, kor_name, eng_name, church, group_name, is_guest,
        kor_sleeping_area, eng_sleeping_area, gender, fee, speak_korean, speak_english, speak_spanish, speak_chinese,
        is_checked_in, is_fee_paid, remark) 
        VALUES((SELECT event_id FROM events WHERE isCurrent="Y"),(SELECT PRINTF('%06d',IFNULL(Max(p_id)+1,1)) FROM participants),
        "${row.kor_name}", "${row.eng_name}", "${row.church}", "${row.group_name}", "${row.is_guest}",
        "${row.kor_sleeping_area}", "${row.eng_sleeping_area}","${row.gender}",${row.fee},"${row.speak_korean}",
        "${row.speak_english}","${row.speak_spanish}","${row.speak_chinese}","N","N", "${row.remark}")`, 
        (err, data) =>{if(err){return err.message;} });
    }
    db.exec('COMMIT');
  })
})

// Delete Participant
ipcMain.handle('delete-participant', (event, args) =>{
  db.run(`DELETE FROM participants WHERE p_id IN (${args.p_id})`, (err, data) =>{ if(err) return err.message; })
  return "Participant Deleted!";
})

// Update Participant
ipcMain.handle('update-participant', (event, args) =>{
  db.run(`UPDATE participants
    SET kor_name="${args.kor_name}", eng_name="${args.eng_name}", church="${args.church}",
        group_name="${args.group_name}", is_guest="${args.is_guest}", kor_sleeping_area="${args.kor_sleeping_area}",
        eng_sleeping_area="${args.eng_sleeping_area}", gender="${args.gender}", fee=${args.fee},
        speak_korean="${args.speak_korean}", speak_english="${args.speak_english}", speak_spanish="${args.speak_spanish}",
        speak_chinese="${args.speak_chinese}", is_checked_in="${args.is_checked_in}", is_fee_paid="${args.is_fee_paid}",
        remark="${args.remark}" WHERE p_id = ${args.p_id}`,  (err, data) =>{if(err){console.log(err.message); return err.message;} })
  return "Participant Update!";
})

// Check In Participant
ipcMain.handle('check-in-participant', (event, args) =>{
  db.run(`UPDATE participants SET is_checked_in="Y"
    WHERE barcode = "${args.barcode}"`,  (err, data) =>{if(err){console.log(err.message); return err.message;} })
  return "Participant Checked In!";
})

// Check In Many Participant
ipcMain.handle('check-in-many-participants', (event, args) =>{
  db.run(`UPDATE participants SET is_checked_in="Y"
    WHERE p_id IN (${args.p_id})`,  (err, data) =>{if(err){console.log(err.message); return err.message;} })
  return "Participants Checked In!";
})

// Mark As Paid Participants
ipcMain.handle('mark-as-paid-participants', (event, args) =>{
  db.run(`UPDATE participants SET is_fee_paid="Y"
    WHERE p_id IN (${args.p_id})`,  (err, data) =>{if(err){console.log(err.message); return err.message;} })
  return "Participants are marked as paid!";
})

// Accounting Report
ipcMain.on('request-accounting-report', async (event, args) => {
  db.all(`WITH Temp AS(
    SELECT DISTINCT church, 
      SUM(CASE WHEN group_name='Father' OR group_name='Pastor' THEN 1 ELSE 0 END) father,
      SUM(CASE WHEN group_name='Mother' THEN 1 ELSE 0 END) mother,
      SUM(CASE WHEN group_name='Young Adult' THEN 1 ELSE 0 END) young_adult,
      SUM(CASE WHEN group_name='Youth Group' THEN 1 ELSE 0 END) youth_group,
      SUM(CASE WHEN group_name='Elementary' THEN 1 ELSE 0 END) elementary,
      SUM(CASE WHEN group_name='Kindergarden' THEN 1 ELSE 0 END) kindergarden,
      SUM(CASE WHEN group_name='Senior' THEN 1 ELSE 0 END) senior,
      COUNT(p_id) as total_number,
      SUM(CASE WHEN is_guest='Y' THEN 1 ELSE 0 END) total_guest,
      SUM(fee) as total_fee
    FROM participants
    WHERE event_id=(SELECT event_id FROM events WHERE isCurrent='Y')
          AND is_fee_paid='Y'
    GROUP BY church ORDER BY church)
    
    SELECT * FROM Temp
    UNION ALL
    SELECT 'Total', SUM(father), SUM(mother), SUM(young_adult), SUM(youth_group), SUM(elementary), SUM(kindergarden), SUM(senior), SUM(total_number), SUM(total_guest), SUM(total_fee) 
    FROM Temp;`, (err, data) => {
    if(err) console.log(err.message);
    else event.sender.send('get-accounting-report', data);
  })
})

// Lodging Report
ipcMain.on('request-lodging-report', async (event, args) => {
  db.all(`WITH Temp AS(
    SELECT DISTINCT a.eng_sleeping_area, a.kor_sleeping_area
    , SUM(CASE WHEN b.church='ATLANTA' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) atlanta
    , SUM(CASE WHEN b.church='CHICAGO' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) chicago
    , SUM(CASE WHEN b.church='KENTUCKY' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) kentucky
    , SUM(CASE WHEN b.church='MICHIGAN' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) michigan
    , SUM(CASE WHEN b.church='NEW JERSEY' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) new_jersey
    , SUM(CASE WHEN b.church='NEW YORK' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) new_york
    , SUM(CASE WHEN b.church='S. ILLINOIS' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) s_illinois
    , SUM(CASE WHEN b.church='S. VIRGINIA' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) s_virginia
    , SUM(CASE WHEN b.church='WASHINGTON' AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) washington
    , SUM(CASE WHEN b.church NOT IN ('ATLANTA', 'CHICAGO', 'KENTUCKY', 'MICHIGAN', 'NEW JERSEY', 'NEW YORK', 'S. ILLINOIS', 'S. VIRGINIA', 'WASHINGTON') AND b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) other
    , SUM(CASE WHEN b.eng_sleeping_area=a.eng_sleeping_area THEN 1 ELSE 0 END) total_number
    FROM Sleeping_Area a, Participants b
    WHERE b.event_id=(SELECT event_id FROM events WHERE isCurrent='Y')
          AND b.is_checked_in = 'Y'
    GROUP BY a.eng_sleeping_area ORDER BY a.s_id
  )
  
  SELECT * FROM Temp
  UNION ALL
  SELECT 'Total', 'Total', SUM(atlanta), SUM(chicago), 
    SUM(kentucky), SUM(michigan), SUM(new_jersey), SUM(new_york), SUM(s_illinois), SUM(s_virginia), SUM(washington), SUM(other), SUM(total_number) FROM Temp`,
    (err, data) => {
    if(err) console.log(err.message);
    else event.sender.send('get-lodging-report', data);
  })
})

// Group Report
ipcMain.on('request-group-report', async (event, args) => {
  db.all(`WITH Temp AS(
    SELECT DISTINCT group_name
    , SUM(CASE WHEN church='ATLANTA' THEN 1 ELSE 0 END) atlanta
    , SUM(CASE WHEN church='CHICAGO' THEN 1 ELSE 0 END) chicago
    , SUM(CASE WHEN church='KENTUCKY' THEN 1 ELSE 0 END) kentucky
    , SUM(CASE WHEN church='MICHIGAN' THEN 1 ELSE 0 END) michigan
    , SUM(CASE WHEN church='NEW JERSEY' THEN 1 ELSE 0 END) new_jersey
    , SUM(CASE WHEN church='NEW YORK' THEN 1 ELSE 0 END) new_york
    , SUM(CASE WHEN church='S. ILLINOIS' THEN 1 ELSE 0 END) s_illinois
    , SUM(CASE WHEN church='S. VIRGINIA' THEN 1 ELSE 0 END) s_virginia
    , SUM(CASE WHEN church='WASHINGTON' THEN 1 ELSE 0 END) washington
    , SUM(CASE WHEN church NOT IN ('ATLANTA', 'CHICAGO', 'KENTUCKY', 'MICHIGAN', 'NEW JERSEY', 'NEW YORK', 'S. ILLINOIS', 'S. VIRGINIA', 'WASHINGTON') THEN 1 ELSE 0 END) other
    , COUNT(p_id) total_number
    FROM participants
    WHERE event_id=(SELECT event_id FROM events WHERE isCurrent='Y')
      AND is_checked_in = 'Y'
    GROUP BY group_name 
    ORDER BY CASE group_name 
      WHEN 'Father' THEN 0 
      WHEN 'Mother' THEN 1
      WHEN 'Baby' THEN 2
      WHEN 'Kindergarden' THEN 3
      WHEN 'Senior' THEN 4
      WHEN 'Pastor' THEN 5 
      WHEN 'Young Adult' THEN 6 
      WHEN 'Youth Group' THEN 7 
      ELSE 8 END
  )
  
  SELECT * FROM Temp
  UNION ALL
  SELECT 'Total',	SUM(atlanta), SUM(chicago), SUM(kentucky), SUM(michigan), SUM(new_jersey), SUM(new_york), SUM(s_illinois), SUM(s_virginia), SUM(washington), SUM(other), SUM(total_number)
  FROM Temp;`,
    (err, data) => {
    if(err) console.log(err.message);
    else event.sender.send('get-group-report', data);
  })
})

// Language Report
ipcMain.on('request-language-report', async (event, args) => {
  db.all(`WITH Temp AS(
    SELECT DISTINCT church
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='N' AND speak_spanish='N' AND speak_chinese='N' THEN 1 ELSE 0 END) KR
      , SUM(CASE WHEN speak_korean='N' AND speak_english='Y' AND speak_spanish='N' AND speak_chinese='N' THEN 1 ELSE 0 END) EN
      , SUM(CASE WHEN speak_korean='N' AND speak_english='N' AND speak_spanish='Y' AND speak_chinese='N' THEN 1 ELSE 0 END) SP
      , SUM(CASE WHEN speak_korean='N' AND speak_english='N' AND speak_spanish='N' AND speak_chinese='Y' THEN 1 ELSE 0 END) CH
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='Y' AND speak_spanish='N' AND speak_chinese='N' THEN 1 ELSE 0 END) KR_EN
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='N' AND speak_spanish='Y' AND speak_chinese='N' THEN 1 ELSE 0 END) KR_SP
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='N' AND speak_spanish='N' AND speak_chinese='Y' THEN 1 ELSE 0 END) KR_CH
      , SUM(CASE WHEN speak_korean='N' AND speak_english='Y' AND speak_spanish='Y' AND speak_chinese='N' THEN 1 ELSE 0 END) EN_SP
      , SUM(CASE WHEN speak_korean='N' AND speak_english='Y' AND speak_spanish='N' AND speak_chinese='Y' THEN 1 ELSE 0 END) EN_CH
      , SUM(CASE WHEN speak_korean='N' AND speak_english='N' AND speak_spanish='Y' AND speak_chinese='Y' THEN 1 ELSE 0 END) SP_CH
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='Y' AND speak_spanish='Y' AND speak_chinese='N' THEN 1 ELSE 0 END) KR_EN_SP
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='Y' AND speak_spanish='N' AND speak_chinese='Y' THEN 1 ELSE 0 END) KR_EN_CH
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='N' AND speak_spanish='Y' AND speak_chinese='Y' THEN 1 ELSE 0 END) KR_SP_CH
      , SUM(CASE WHEN speak_korean='N' AND speak_english='Y' AND speak_spanish='Y' AND speak_chinese='Y' THEN 1 ELSE 0 END) EN_SP_CH
      , SUM(CASE WHEN speak_korean='Y' AND speak_english='Y' AND speak_spanish='Y' AND speak_chinese='Y' THEN 1 ELSE 0 END) KR_EN_SP_CH
      , COUNT(p_id) as total
    FROM participants
    WHERE event_id=(SELECT event_id FROM events WHERE isCurrent='Y')
      AND is_checked_in='Y'
    GROUP BY church ORDER BY church
    )
    
    SELECT * FROM Temp
    UNION ALL
    SELECT 'Total', SUM(KR), SUM(EN), SUM(SP), SUM(CH), SUM(KR_EN), SUM(KR_SP), SUM(KR_CH), SUM(EN_SP), SUM(EN_CH), SUM(SP_CH), SUM(KR_EN_SP), SUM(KR_EN_CH), SUM(KR_SP_CH), SUM(EN_SP_CH), SUM(KR_EN_SP_CH), SUM(total) FROM TEMP
    `,
    (err, data) => {
    if(err) console.log(err.message);
    else event.sender.send('get-language-report', data);
  })
})

function createWindow() {
  db.run(`CREATE TABLE IF NOT EXISTS events (
            event_id INTEGER PRIMARY KEY NOT NULL,
            event_name TEXT NOT NULL, 
            isCurrent TEXT NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS church (
    c_id INTEGER PRIMARY KEY NOT NULL,
    church_name TEXT NOT NULL, 
    isHidden TEXT NOT NULL)`);
  db.run(`CREATE TABLE IF NOT EXISTS sleeping_area (
    s_id INTEGER PRIMARY KEY NOT NULL,
    kor_sleeping_area TEXT NOT NULL UNIQUE, 
    eng_sleeping_area TEXT NOT NULL UNIQUE,
    isHidden TEXT NOT NULL)`);
    // , () => {
    //   db.run(`INSERT OR IGNORE INTO sleeping_area(s_id, kor_sleeping_area, eng_sleeping_area)
    //      VALUES (1, '호텔', 'Hotel'),  (2, '텐트', 'Tent'), (3, '차량', 'Car'), (4, '베데스다', 'Bethesda'),
    //     (5, '소망관 1층', 'Hope Hall 1st'), (6, '소망관 2층', 'Hope Hall 2nd'), (7, '유아방', 'Nursery Room'),
    //     (8, '디모데관', 'Timothy Hall'), (9, '요셉관', 'Joseph Hall'), (10, '사무엘관 1층', 'Samuel Hall 1st'),
    //     (11, '사무엘관 2층', 'Samuel Hall 2nd'), (12, '엘리야관', 'Elijah Hall'), (13, '엘리사관', 'Elisha Hall'),
    //     (14, '사랑관', 'Charity Hall'), (15, '은혜관', 'Grace Hall'), (16, '빌라델비아관', 'Philadelpia Hall'),
    //     (17, '아틀란타 캐빈', 'ATL Cabin'), (18, '시카고 모빌홈', 'Chicago Mobile Home'), (19, '뉴저지 캐빈', 'NJ Cabin'),
    //     (20, '워싱턴 캐빈', 'Washington Cabin'), (21, '워싱턴 모빌홈', 'Washington Mobile Home'), (22, '주방숙소', 'Kitchen Area'),
    //     (23, '캐빈 1', 'Cabin 1'), (24, '캐빈 2', 'Cabin 2'), (25, '캐빈 3', 'Cabin 3'),
    //     (26, '캐빈 4', 'Cabin 4'), (27, '캐빈 5', 'Cabin 5'), (28, '캐빈 6', 'Cabin 6'), (29, '사택', '사택')`);
    // });
  db.run(`CREATE TABLE IF NOT EXISTS participants (
            p_id INTEGER PRIMARY KEY NOT NULL, 
            event_id INTEGER NOT NULL,
            barcode TEXT,
            kor_name TEXT,
            eng_name TEXT,
            church TEXT NOT NULL,
            group_name TEXT,
            is_guest TEXT,
            kor_sleeping_area TEXT,
            eng_sleeping_area TEXT,
            gender TEXT,
            fee REAL,
            speak_korean TEXT,
            speak_english TEXT,
            speak_spanish TEXT,
            speak_chinese TEXT,
            is_checked_in TEXT,
            is_fee_paid TEXT,
            remark TEXT,
            FOREIGN KEY(event_id) REFERENCES events(event_id))`);
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: isDev 
        ? path.join(app.getAppPath(), './public/preload.js') // Loading it from the public folder for dev
        : path.join(app.getAppPath(), './build/preload.js'), // Loading it from the build folder for production
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true
    }
  })

  // Loading a webpage inside the electron window we just created
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
    // isDev
    //   ? 'http://localhost:3000'
    //   : `file://${path.join(__dirname, '../build/index.html')}`
  )

  // Setting Window Icon - Asset file needs to be in the public/images folder.
  //win.setIcon(path.join(__dirname, 'images/appicon.ico'));

  // In development mode, if the window has loaded, then load the dev tools.
  if (isDev) {
    win.webContents.on('did-frame-finish-load', () => {
      win.webContents.openDevTools({ mode: 'detach' });
    });
  }
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  db.close();
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // On certificate error we disable default behaviour (stop loading the page)
  // and we then say "it is all fine - true" to the callback
  event.preventDefault();
  callback(true);
})