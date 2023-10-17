const tf = require('@tensorflow/tfjs-node');
const trainingData = require('./data/training-data.json');

const buildModel = () => {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 8, inputShape: [1], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

    model.compile({ optimizer: 'sgd', loss: 'categoricalCrossentropy', metrics: ['accuracy'] });

    return model;
};

const trainModel = async (model) => {
    const trainingPatterns = [0, 1]; // Assign numbers for the two patterns (greeting and goodbye)
    const trainingLabels = [[1, 0], [0, 1]]; // One-hot encoded labels

    const xs = tf.tensor2d(trainingPatterns, [2, 1]);
    const ys = tf.tensor2d(trainingLabels);

    await model.fit(xs, ys, { epochs: 200 });
};

const getResponse = (model, pattern) => {
    // Simple way to determine greeting or goodbye
    // For this basic model, greeting patterns are 0 and goodbye patterns are 1
    const prediction = model.predict(tf.tensor2d([pattern], [1, 1]));
    const index = prediction.argMax(1).dataSync()[0];

    const intent = trainingData.intents[index];
    const randomResponseIndex = Math.floor(Math.random() * intent.responses.length);

    return intent.responses[randomResponseIndex];
};

const chatbot = {
    model: buildModel(),
    async train() {
        await trainModel(this.model);
    },
    talk(pattern) {
        return getResponse(this.model, pattern);
    }
};

module.exports = chatbot;
