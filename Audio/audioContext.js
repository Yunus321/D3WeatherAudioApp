
//define frequencies of each weather parameter

const frequencies = [264,330,352,396,528]
// [264,330,352,396,528] <-> [c',e',f',g',c''] <-> [temperature,windspeed,rainfallsum,snowfallsum,rel. humidity]

function startSound(_currentGlyphValues, _soundVolume) {

    gainNode = ctx.createGain()
    gainNode.gain.value = _soundVolume
    var summedFrequencies = conversionAndSumOfFrequencies(_currentGlyphValues)
    var buf = new Float32Array(summedFrequencies.length)
    for (var i = 0; i < summedFrequencies.length; i++) buf[i] = summedFrequencies[i]
    var buffer = ctx.createBuffer(1,buf.length,ctx.sampleRate)
    buffer.copyToChannel(buf,0)
    source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(gainNode)
    gainNode.connect(ctx.destination)
    source.start(0)
    source.loop = true
    return summedFrequencies
}

function stopSound() {
    source.stop(0)
}

function changeVolume(newVolume) {
    gainNode.gain.value = newVolume
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
        for (var j = 0; j < ctx.sampleRate; j++) { //_currentGlyphValues[j] returns the amplitude of each weather feature
            arr[j] = calculateSineWave(j,frequencies[i],ctx) *  calcAmplitude(_currentGlyphValues[i]) 
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