const getVocabulary = (documents) => {
  var unique = [];
  documents.forEach((doc) => {
    doc
      .toLowerCase()
      .split(" ")
      .forEach((w) => {
        if (!unique.includes(w)) unique.push(w);
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
  let words = str.split(" ");
  let wordCount = {};
  words.forEach((w) => {
    wordCount[w] = (wordCount[w] || 0) + 1;
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

const cosineSimilarity = (a, b) => {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
};

function dotProduct(vecA, vecB) {
  let product = 0;
  for (let i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

function magnitude(vec) {
  let sum = 0;
  for (let i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

var query = "How much wood does the wood chuck chuck";

var document1 =
  "If a wood chuck could chuck wood would a wood chuck wood chuck wood";

var document2 = "The quick brown fox does some shit";

var document3 = "A wood chipper chips wood";

var documents = [document1, document2, document3, query];
var vocabulary = getVocabulary(documents);

idf = calculateIdf(documents, vocabulary);

documents.forEach((doc) => {
  console.log(wordCountMap(doc));
});

console.log("IDF Matrix: ", idf);
