const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    
    // Request and Get ALL Events
    requestAllEvent: (args) => ipcRenderer.send('request-all-event', args),
    getAllEvent: (callback) => ipcRenderer.on('get-all-event', (event, data) => {callback(data)}),
    // set Current Event
    setCurrentEvent: (args) => ipcRenderer.invoke('set-current-event', args),
    // create / delete Event
    createEvent: (args) => ipcRenderer.invoke('create-event', args),
    deleteEvent: (args) => ipcRenderer.invoke('delete-event', args),


    // Request and Get ALL Church
    requestAllChurch: (args) => ipcRenderer.send('request-all-church', args),
    getAllChurch: (callback) => ipcRenderer.on('get-all-church', (event, data) => {callback(data)}),
    // add / delete Church
    addChurch: (args) => ipcRenderer.invoke('add-church', args),
    deleteChurch: (args) => ipcRenderer.invoke('delete-church', args),
    // hide / show Church
    hideChurch: (args) => ipcRenderer.invoke('hide-church', args),
    showChurch: (args) => ipcRenderer.invoke('show-church', args),

    // Request and Get ALL Sleeping Area
    requestAllSleeping_Area: (args) => ipcRenderer.send('request-all-sleeping_area', args),
    getAllSleeping_Area: (callback) => ipcRenderer.on('get-all-sleeping_area', (event, data) => {callback(data)}),
    // add / delete Sleeping Area
    addSleeping_Area: (args) => ipcRenderer.invoke('add-sleeping_area', args),
    deleteSleeping_Area: (args) => ipcRenderer.invoke('delete-sleeping_area', args),
    // hide / show Sleeping Area
    hideSleeping_Area: (args) => ipcRenderer.invoke('hide-sleeping_area', args),
    showSleeping_Area: (args) => ipcRenderer.invoke('show-sleeping_area', args),

    // Request and GET Current Participants
    requestCurrentParticipants: (args) => ipcRenderer.send('request-current-participants', args),
    getCurrentParticipants: (callback) => ipcRenderer.on('get-current-participants', (event, data) => {callback(data)}),

    // add / add many / delete / update Participant
    addParticipant: (args) => ipcRenderer.invoke('add-participant', args),
    addManyParticipants: (args) => ipcRenderer.invoke('add-many-participants', args),
    deleteParticipant: (args) => ipcRenderer.invoke('delete-participant', args),
    updateParticipant: (args) => ipcRenderer.invoke('update-participant', args),

    // checkIn Participant
    checkInParticipant: (args) => ipcRenderer.invoke('check-in-participant', args),
    checkInManyParticipants: (args) => ipcRenderer.invoke('check-in-many-participants', args),
    markAsPaidParticipants: (args) => ipcRenderer.invoke('mark-as-paid-participants', args),

    // reports
    requestAccountingReport: (args) => ipcRenderer.send('request-accounting-report', args),
    getAccountingReport: (callback) => ipcRenderer.on('get-accounting-report', (event, data) => {callback(data)}),
    requestLodgingReport: (args) => ipcRenderer.send('request-lodging-report', args),
    getLodgingReport: (callback) => ipcRenderer.on('get-lodging-report', (event, data) => {callback(data)}),
    requestGroupReport: (args) => ipcRenderer.send('request-group-report', args),
    getGroupReport: (callback) => ipcRenderer.on('get-group-report', (event, data) => {callback(data)}),
    requestLanguageReport: (args) => ipcRenderer.send('request-language-report', args),
    getLanguageReport: (callback) => ipcRenderer.on('get-language-report', (event, data) => {callback(data)}),
});