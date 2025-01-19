document.addEventListener('DOMContentLoaded', () => {
  // 用語データを取得（data.json）
  fetch('../terms/data.json')
    .then(response => response.json())
    .then(data => {
      const urlParams = new URLSearchParams(window.location.search);
      const termId = urlParams.get('term'); // URLのGETパラメータを取得（例: ?term=log-spoofing）

      if (termId) {
        // termIdに該当するデータを探す
        const termData = data.find(term => term.id === termId);
        
        if (termData) {
          renderTerm(termData);
        } else {
          document.getElementById('term-container').innerHTML = '<p>該当する用語が見つかりません。</p>';
        }
      } else {
        // termパラメータがない場合はリストページを表示（またはホームページ）
        renderTermList(data);
      }
    })
    .catch(error => {
      console.error('データの取得に失敗しました:', error);
      document.getElementById('term-container').innerHTML = '<p>データの取得に失敗しました。</p>';
    });
});

// 用語リストの表示
function renderTermList(terms) {
  const termContainer = document.getElementById('term-container');
  let html = '<h2>用語集</h2><ul>';

  terms.forEach(term => {
    html += `<li><a href="?term=${term.id}">${term.title}</a></li>`;
  });

  html += '</ul>';
  termContainer.innerHTML = html;
}

// 用語詳細の表示
function renderTerm(termData) {
  const termContainer = document.getElementById('term-container');
  
  let html = `
    <article class="term-item">
      <h2>${termData.title}</h2>
  `;
  html = renderImages(termData.images, 'top', html);
  html += `
      <p>${termData.description}</p>
  `;
  html = renderImages(termData.images, 'bottom', html);
  
  // 小見出しの表示
  termData.subheadings.forEach(subheading => {
    html += `
      <div class="subheading">
        <h3>${subheading.title}</h3>
    `;
    html = renderImages(subheading.images, 'top', html);
    html += `
        <p>${subheading.content}</p>
    `;
    html = renderImages(subheading.images, 'bottom', html);
    html += `</div>`;
  });

  html += '</article>';
  termContainer.innerHTML = html;
}

// 画像を指定の位置に挿入
function renderImages(images, position, html) {
  if (images && images.length > 0) {
    images.forEach(image => {
      if (image.position === position) {
        const scale = image.scale || 1;
        const scaledWidth = 100 * scale;

        html += `
          <div class="term-image ${position}" style="width: ${scaledWidth}%; height: auto;">
            <img src="/assets/images/${image.src}" alt="画像">
          </div>
        `;
      }
    });
  }
  return html;
}
