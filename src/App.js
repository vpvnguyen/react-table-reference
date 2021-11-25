import styled from "styled-components";
import FilterTable from "./components/Filter";
import CustomFilterTable from "./components/CustomFilter";

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;
const Section = styled.section`
  border: 1px solid grey;
`;

const App = () => {
  return (
    <Main>
      <Section>
        <h1>FilterTable</h1>
        <FilterTable />
      </Section>
      <Section>
        <h1>CustomFilterTable</h1>
        <CustomFilterTable />
      </Section>
    </Main>
  );
};

export default App;
