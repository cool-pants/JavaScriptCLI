var fs = require('fs')

const FILE_PATH = "./task.txt"

var comms = {"add": "$ ./task add 2 hello world    # Add a new item with priority 2 and text \"hello world\" to the list",
             "ls": "$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order",
             "del": "$ ./task del INDEX            # Delete the incomplete item with the given index",
             "done":"$ ./task done INDEX           # Mark the incomplete item with the given index as complete",
             "help": "$ ./task help                 # Show usage",
             "report":"$ ./task report               # Statistics"
            }

function setData(data){
  var dataString = JSON.stringify(data);
  fs.writeFileSync(FILE_PATH,dataString);
}

function getData(){
  var contents = fs.readFileSync(FILE_PATH)
  return JSON.parse(contents)
}

function init(){
  if(!fs.existsSync(FILE_PATH)){
    setData({comp:[],incomp:[]});
  }
}

init();

var task = getData();

if(process.argv[2]=="add") {
  if(process.argv[3]){
    let prio = process.argv[3]
    let desc = process.argv.slice(4).join(' ')
    if(!task.incomp.some(e => e.desc == desc)){
      task.incomp.push({priority:prio,desc:desc})
    }
    if(task.comp.some(e=> e.desc == desc)){
      let index = task.comp.map((o)=>o.desc).indexOf(desc)
      task.comp.splice(index,1)
    }
    task.incomp.sort(function(a,b) {
      return a.priority-b.priority
    })
    setData(task)
    console.log("Added task: \""+desc+"\" with priority "+prio)
  }
  else{
    console.log("Error: Missing tasks string. Nothing added!")
  }
}
else if(process.argv[2]=="ls") {
  if(task.incomp.length>0){
    for(let i=0; i<task.incomp.length; i++){
      console.log((i+1)+". "+task.incomp[i].desc+" ["+task.incomp[i].priority+"]")
    }
  }
  else{
    console.log("There are no pending tasks!")
  }
}
else if(process.argv[2]=="del") {
  if(process.argv[3]){
    let del_no = parseInt(process.argv[3])
    if(del_no<=task.incomp.length && del_no>0){
      task.incomp.splice((del_no-1),1)
      task.incomp.sort(function(a,b) {
        return a.priority-b.priority
      })
      setData(task)
      console.log("Deleted task #"+del_no)
    }
    else{
      console.log("Error: task with index #"+del_no+" does not exist. Nothing deleted.")
    }
  }
  else{
    console.log("Error: Missing NUMBER for deleting tasks.")
  }
}
else if(process.argv[2]=="done") {
  if(process.argv[3]){
    let done_no = parseInt(process.argv[3])
    if(done_no<=task.incomp.length && done_no>0){
      let comped = task.incomp.splice((done_no-1),1)
      task.incomp.sort(function(a,b) {
        return a.priority-b.priority
      })
      task.comp.push({desc:comped[0].desc})
      setData(task)
      console.log("Marked item as done.")
    }
    else{
      console.log("Error: no incomplete item with index #"+done_no+" exists.")
    }
  }
  else{
    console.log("Error: Missing NUMBER for marking tasks as done.")
  }
}
else if(process.argv[2]=="report") {
  console.log("Pending : "+task.incomp.length)
  for(let i=0; i<task.incomp.length; i++){
    console.log((i+1)+". "+task.incomp[i].desc+" ["+task.incomp[i].priority+"]")
  }
  console.log("\nCompleted : "+task.comp.length)
  for(let i=0; i<task.comp.length; i++){
    console.log((i+1)+". "+task.comp[i].desc)
  }
}
else if(process.argv[2] == "help" || process.argv.length<=2) {
  console.log("Usage :-");
  for(i in comms){
    console.log(comms[i]);
  }
}
