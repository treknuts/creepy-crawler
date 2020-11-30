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
  for (const word in vec) {
    sum += vec[word] * vec[word];
  }
  return Math.sqrt(sum);
}

const generateDocumentVectors = (documents) => {
  var freqMap = [];
  documents.forEach((doc) => {
    freqMap.push(wordCountMap(doc));
  });
  return freqMap;
};

function similaritiesFromText(query, documents) {
  var vocabulary = getVocabulary(documents);
  var freqMap = generateDocumentVectors(documents);
  idf = calculateIdf(documents, vocabulary);
  var queryMap = wordCountMap(query);
  var queryVec = {};
  for (const word in queryMap) {
    queryVec[word] = queryMap[word] === 1 ? 1 : queryMap[word] * idf[word];
  }
  tfidf = calculateTfIdf(freqMap, idf);
  similarities = {};
  tfidf.forEach((vec, i) => {
    similarities[i] = Math.round(cosineSimilarity(queryVec, vec) * 100);
    i++;
  });
  return similarities;
}

module.exports = {
  similaritiesFromText: similaritiesFromText,
};
