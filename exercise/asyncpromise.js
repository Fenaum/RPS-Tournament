function promise(data) {
    return new Promise((resolve, reject) => {
        if (data === 'resolved') {
            setTimeout(()=> {
                resolve(data)
            }, 1000) 
        } else {
            setTimeout(() => {
                reject('operation failed')
            })
        }
    })
}

async function processPromise(parameter) {
    try {
        let data = await promise(parameter)
        console.log(data)
    } catch (err) {
        console.error(err)
    }
}

function regular() {
    console.log('normal function')
}

// promise('not correvt').then((data)=>{console.log(data)}).catch(err => console.error(err))
processPromise('resolved');
regular();