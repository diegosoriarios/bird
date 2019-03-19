const twitter = require('twitter')
const config = require('./config')
const readLine = require('readline')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const T = new twitter(config)

let params = {}

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('What are you looking for? ', (answer) => {
    params = {
        q: `#${answer}`,
        count: 10,
        result_type: 'recent',
        lang: 'en'
    }
    favoriteTweet(params)
})

function favoriteTweet(params){
    T.get('search/tweets', params, (err, data, response) => {
        if(!err){
            data.statuses.forEach(tweets => {
                let id = {id: tweets.id_str}
                T.post('favorites/create', id, function(err, response) {
                    if(err) {
                        console.log(err[0].message)
                    } else {
                        let username = response.user.screen_name
                        let tweetId = response.id_str
                        console.log('Favorited: ', `https://twitter.com/${username}/status/${tweetId}`)
                    }
                })
            })
        } else {
            console.log(err)
        }
    })
}