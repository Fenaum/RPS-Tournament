const loop = {
    1: "1",
    2: "2",
    3: "3",
    4: "4",
    6: "6",
    5: "5",
}

for (const numKey in loop) {
    if (loop.hasOwnProperty(numKey)) {
        console.log(numKey)
    }
}