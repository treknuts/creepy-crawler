// Words to ignore (a, an, of, or, and, the)

const stopWords = ["a", "an", "of", "or", "and", "the"];

const getVocabulary = (documents) => {
  var unique = [];
  documents.forEach((doc) => {
    doc
      .toLowerCase()
      .split(" ")
      .forEach((w) => {
        if (!unique.includes(w) && !stopWords.includes(w)) unique.push(w);
      });
  });
  return unique;
};

const count = (arr, word) => {
  var count = 0;
  arr.forEach((w) => {
    if (w === word) count++;
  });

  return count;
};

const calculateWeight = () => {
  // weight = tf * idf
};

function wordCountMap(str) {
  let words = str.toLowerCase().split(" ");
  let wordCount = {};
  words.forEach((w) => {
    if (!stopWords.includes(w)) {
      wordCount[w] = (wordCount[w] || 0) + 1;
    }
  });
  return wordCount;
}

function addWordsToDictionary(wordCountmap, dict) {
  for (let key in wordCountmap) {
    dict[key] = true;
  }
}

function wordMapToVector(map, dict) {
  let wordCountVector = [];
  for (let term in dict) {
    wordCountVector.push(map[term] || 0);
  }
  return wordCountVector;
}

const normTermFreq = (word, document) => {
  // tfNorm = 1 + log(tfRaw)
  rawFreq = count(document, word);
  console.log("Raw Frequency:", rawFreq);
  console.log("Normalized Frequency: ", 1 + Math.log10(rawFreq));
  return 1 + Math.log10(rawFreq);
};

const docsContainWord = (documents, word) => {
  docCount = 0;
  documents.forEach((doc) => {
    if (doc.includes(word)) docCount++;
  });
  return docCount;
};

const calculateIdf = (documents, vocabulary) => {
  // idf(t) = 1 + log(nTotal / ndocs(t))
  // nTotal = total documents
  // ndocs(t) = the number of documents that contain t
  var idf = {};

  vocabulary.forEach((word) => {
    containsWord = docsContainWord(documents, word);
    idf[word] = 1 + Math.log10(documents.length / containsWord);
  });

  return idf;
};

const calculateTfIdf = (tf, idf) => {
  tfidf = [];
  tf.forEach((doc) => {
    vec = {};
    for (const word in doc) {
      vec[word] = doc[word] === 1 ? 1 : doc[word] * idf[word];
    }
    tfidf.push(vec);
  });
  return tfidf;
};

const cosineSimilarity = (a, b) => {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
};

function dotProduct(vecA, vecB) {
  var product = 0;
  for (const word in vecA) {
    if (Object.keys(vecB).includes(word)) product += vecA[word] * vecB[word];
  }
  return product;
}

function magnitude(vec) {
  let sum = 0;
  // for (let i = 0; i < vec.length; i++) {
  //   sum += vec[i] * vec[i];
  // }
  for (const word in vec) {
    sum += vec[word] * vec[word];
  }
  return Math.sqrt(sum);
}

const similaritiesFromText = (query, documents) => {};

var query = "How much wood does the wood chuck chuck";

var document1 =
  "If a wood chuck could chuck wood would a wood chuck wood chuck wood";

var document2 = "The quick brown fox does some shit";

var document3 = "A wood chipper chips wood";

var documents = [document1, document2, document3];

var vocabulary = getVocabulary(documents);

var freqMap = [];
documents.forEach((doc) => {
  freqMap.push(wordCountMap(doc));
});

// console.log("Document term frequencies: ", freqMap);

idf = calculateIdf(documents, vocabulary);

var queryMap = wordCountMap(query);
var queryVec = {};
for (const word in queryMap) {
  queryVec[word] = queryMap[word] === 1 ? 1 : queryMap[word] * idf[word];
}

tfidf = calculateTfIdf(freqMap, idf);

var docMagnitudes = [];
tfidf.forEach((vec) => {
  docMagnitudes.push(magnitude(vec));
});

var dotProducts = [];
tfidf.forEach((vec) => {
  dotProducts.push(dotProduct(queryVec, vec));
});

similarities = [];
tfidf.forEach((vec) => {
  similarities.push(Math.round(cosineSimilarity(queryVec, vec) * 100));
});

console.log("Query vector: ", queryVec);
console.log("Document vectors: ", freqMap);
console.log("TFIDF Matrix: ", calculateTfIdf(freqMap, idf));
console.log("Dot products: ", dotProducts);
console.log("Query magnitude: ", magnitude(queryVec));
console.log("Document magnitudes", docMagnitudes);
console.log("Similarities", similarities);

// const comparator = require("string-similarity");

// var matches = comparator.findBestMatch(query, documents);

// console.log("Search matches: ", matches);

// matches.ratings.sort((a, b) => (a.rating > b.rating ? -1 : 1));

// console.log("Sorted matches: ", matches);
