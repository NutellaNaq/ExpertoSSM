type props = {
  mainTitle: string;
};

function TitlePage({ mainTitle }: props) {
  return (
    <div id="title-container">
      <div id="main-title">
        <h1>{mainTitle}</h1>
      </div>
    </div>
  );
}

export default TitlePage;
