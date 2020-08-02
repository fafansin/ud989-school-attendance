const model = {
    init:function(){
        if (!localStorage.attendance) {
            console.log('Creating attendance records...');
            function getRandom() {
                return (Math.random() >= 0.5);
            }
    
            var nameColumns = $('tbody .name-col'),
                attendance = {};
    
            nameColumns.each(function() {
                var name = this.innerText;
                attendance[name] = [];
    
                for (var i = 0; i <= 11; i++) {
                    attendance[name].push(getRandom());
                }
            });
            localStorage.attendance = JSON.stringify(attendance);
        }
    },
    getAttendace:function(){
        return JSON.parse(localStorage.attendance);
    },
    setAttendance:function(attendance){
        localStorage.attendance = JSON.stringify(attendance);
    }
}

const controller = {
    init:function(){
        view.init();
    },
    getAttendance:function(){
        return model.getAttendace();
    },
    updateStudent:function(studentName){
        let students = model.getAttendace();
        students[studentName] = view.getAttendance(studentName);
        //
        model.setAttendance(students);
        view.render();
    }
}

const view = {
    tbody: null,
    init:function(){
        this.tbody = document.querySelector('tbody');
        //
        this.tbody.addEventListener("click", function(e){
            if(e.target.tagName == 'INPUT'){
                controller.updateStudent(e.target.dataset.student);
            }
        })
        
        this.render();
        
    },
    render:function(){
        const students = controller.getAttendance();
        htmlString = '';

        for(let studentName in students){
            htmlString += `<tr id="${studentName}" class="student"><td class="name-col">${studentName}</td>`;

            let days = students[studentName].map((day)=>{
                return `<td class="attend-col"><input data-student="${studentName}" type="checkbox" ${day ? 'checked' : ''}></td>`;
            });

            let absent = students[studentName].filter((day)=>{
                return day === false;
            });

            htmlString += days.join('');
            htmlString += `<td class="missed-col">${absent.length}</td></tr>`;
        }
        this.tbody.innerHTML = htmlString;
    },
    getAttendance:function(studentName){
        let days = document.getElementById(studentName).querySelectorAll("input[type=checkbox]");
        let attendance = [...days].map(day=>{
            return day.checked;
        })

        return attendance;
    }
}

controller.init();