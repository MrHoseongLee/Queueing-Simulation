class Person {
    constructor(type, x, y) {
        this.type = type
        this.x = x
        this.y = y
        this.target_x = -100
        this.target_y = -100
    }

    setTarget(x, y) {
        this.target_x = x
        this.target_y = y
    }

    updatePos(percent) {
        const dx = this.target_x - this.x
        const dy = this.target_y - this.y
        this.x = this.x + dx * percent
        this.y = this.y + dy * percent
    }

}

var intervalCount = 0
const boxSize = 50
const timePerStep = 1000

function start() {
    const input = textBox.value.split(/[\n\r]+/)
    title.style.display = 'none'
    textBox.style.display = 'none'
    startButton.style.display = 'none'
    textBox.value = ""

    const data = input[0].split(' ')

    customers = Array(data[0])
    employees = Array(data[1])
    atms = Array(data[2])

    height = 100 * (data[1] * 1 + data[2] * 1 + 2) - boxSize

    const employee_line_y = 50 * (data[1] * 1 + 1)
    const atm_line_y = employee_line_y * 2 + 50 * (data[2] * 1 + 0.5)

    let employee_line_x = innerWidth * 9 / 10 - boxSize * 5
    let atm_line_x = innerWidth * 9 / 10 - boxSize * 5

    canvas.height =  height

    let employee_line = 0
    let atm_line = 0

    c = canvas.getContext('2d')

    for(let i=0; i < data[0]; ++i) {
        customers[i] = new Person(0, -boxSize, height / 2)
    }

    for(let i=0; i < data[1]; ++i) {
        employees[i] = new Person(1, innerWidth * 9 / 10 - boxSize / 2, (i + 1) * 100)
    }

    for(let i=0; i < data[2]; ++i) {
        atms[i] = new Person(2, innerWidth * 9 / 10, (i + 2 + data[1] * 1) * 100)
    }

    let currentTime = 0
    let i = 1

    function step() {
        const data = input[i].split(' ')
        const eventType = data[1] * 1
        const customerID = data[2] * 1

        if(eventType == 0) {
            if(customers[customerID].x < 0) {
                customers[customerID].x = 0
                customers[customerID].y = employee_line_y
            }
            customers[customerID].setTarget(employee_line_x - employee_line * boxSize * 2, employee_line_y)
            ++employee_line
        }

        if(eventType == 1) {
            if(customers[customerID].x < 0) {
                customers[customerID].x = 0
                customers[customerID].y = atm_line_y
            }
            customers[customerID].setTarget(atm_line_x - atm_line * boxSize * 2, atm_line_y)
            ++atm_line
        }

        if(eventType == 2) {
            const employeeID = data[3] * 1
            customers[customerID].setTarget(employee_line_x + boxSize * 2, employees[employeeID].y)
            for(let j=0; j < customers.length; ++j) {
                if(customers[j].y == employee_line_y && customers[j].target_y == employee_line_y 
                    && customers[j].x != employee_line_x + boxSize * 2 && customers[j].target_x != employee_line_x + boxSize * 2) {
                    if (j != customerID) {
                        customers[j].target_x += boxSize * 2
                    }
                }
            }
            --employee_line
        }

        if(eventType == 3) {
            const atmID = data[3] * 1
            customers[customerID].setTarget(atm_line_x + boxSize * 2, atms[atmID].y - boxSize / 2)
            for(let j=0; j < customers.length; ++j) {
                if(customers[j].y == atm_line_y && customers[j].target_y == atm_line_y && customers[j].x != atm_line_x + boxSize * 2
                    && customers[j].target_x != atm_line_x + boxSize * 2) {
                    if (j != customerID) {
                        customers[j].target_x += boxSize * 2
                    }
                }
            }
            --atm_line
        }

        if(eventType == 4) {
            customers[customerID].target_x = -100
        }

        if(currentTime != data[0] * 1) {
            intervalCount = 0
            const interval = setInterval(animate, 50)
            setTimeout(function(){ 
                clearInterval(interval);
                if(i < input.length) {
                    ++i;
                    step();
                }
            }, 1000)
        } else {
            if (i < input.length) {
                ++i
                step()
            }
        }
        currentTime = data[0] * 1
    }

    for(let i=0; i < employees.length; ++i) {
        c.beginPath()
        c.arc(employees[i].x, employees[i].y, boxSize / 2, 0, 2*Math.PI)
        c.fillStyle = 'rgb(68, 114, 196)'
        c.fill()
    }

    for(let i=0; i < atms.length; ++i) {
        c.fillStyle = 'rgb(112, 173, 71)'
        c.fillRect(atms[i].x - boxSize, atms[i].y - boxSize, boxSize, boxSize)
    }


    step()

    /*
    title.style.display = 'block'
    textBox.style.display = 'inline'
    startButton.style.display = 'block'
    */
}

function animate() {
    c.clearRect(0, 0, 9 / 10 * innerWidth - boxSize, height)

    for(let i=0; i < customers.length; ++i) {
        if((customers[i].target_x > 0 && customers[i].target_y > 0) || (customers[i].target_x < 0 && customers[i].x > 0)) {
            customers[i].updatePos(intervalCount/20)
            if(customers[i].x > 0) {
                c.beginPath()
                c.arc(customers[i].x, customers[i].y, boxSize / 2, 0, 2*Math.PI)
                c.fillStyle = 'rgb(237, 125, 49)'
                c.fill()
            }
        }
        
    }

    intervalCount += 1

}

const title = document.getElementById("title")
const textBox = document.getElementById("input_logs")
const startButton = document.getElementById("start")
const canvas = document.querySelector("canvas")
var c
var height
var customers
var employees
var atms

canvas.width = window.innerWidth

startButton.setAttribute("onClick", "javascript: start();")

