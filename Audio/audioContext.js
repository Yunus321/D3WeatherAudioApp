
//Define frequencies of each weather parameter
//conversion -> [temperature = 440 Hz (Kammerton), wind_speed = 330 Hz, rain_sum = 297 Hz, snowfall_sum = 264 Hz, humidity = 396 Hz]
//TODO! improve the sound -> user can change the frequency of each feature !!!!!
///const frequencies = [440,330,297,264,396] / [440,330,297,396,264] / 297,330,440,396,264]

const frequencies = [297,330,440,396,264] //humidity should get a lower frequency !

function startSound(_currentGlyphValues, _soundVolume) {

    gainNode = ctx.createGain()
    gainNode.gain.value = _soundVolume
    gainNode.connect(ctx.destination)
    var summedFrequencies = conversionAndSumOfFrequencies(_currentGlyphValues)
    var buf = new Float32Array(summedFrequencies.length)
    for (var i = 0; i < summedFrequencies.length; i++) buf[i] = summedFrequencies[i]
    var buffer = ctx.createBuffer(1,buf.length,ctx.sampleRate)
    buffer.copyToChannel(buf,0)
    source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(gainNode)
    source.start()
    source.loop = true
    return summedFrequencies
}

function stopSound() {
    source.stop(0)
}

function changeVolume(setNewVolume) {
    gainNode.gain.value = setNewVolume
    source.connect(ctx.destination)
}

function conversionAndSumOfFrequencies(_currentGlyphValues) {

    calcAmplitude = d3.scaleLinear()
    .domain([0, glyphRadius])
    .range([0, 1]) // max amplitude of each frequency
    var sumOfFrequencies = []
    for(var k = 0; k < ctx.sampleRate; k++) {
        sumOfFrequencies[k] = 0
    }

    for (var i = 0; i < _currentGlyphValues.length; i++) {
        var arr = []
        for (var j = 0; j < ctx.sampleRate; j++) {
            arr[j] = calculateSineWave(j,frequencies[i],ctx) *  calcAmplitude(_currentGlyphValues[i]) //_currentGlyphValues[j] gives the amplitude of each weather feature 
        }
        for(var m = 0; m < ctx.sampleRate; m++) {
            sumOfFrequencies[m] += arr[m]
        }
    }
    var normSummedFrequencies = d3.scaleLinear()
    .domain([-5, 5])
    .range([-1, 1])

    sumOfFrequencies = sumOfFrequencies.map(x => normSummedFrequencies(x));

    return sumOfFrequencies
}

function calculateSineWave(sampleNumber, tone,context) {
    var sampleFreq = context.sampleRate/ tone
    return Math.sin(sampleNumber / (sampleFreq / (Math.PI *2)))
}