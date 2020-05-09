import React, { useState, useEffect } from 'react';
import * as csv from "csvtojson";
import theme from './themes'
import { ThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import styled from 'styled-components';


const useFetch = (url, options) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url, options);
        const text = await res.text();
        csv().fromString(text).then(json => setResponse(json));
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);
  return { response, error };
};

const groupAnswers = array => {
  return array.map(arr => {
    let pureAnswer = {
      ...arr
    }

    const ignoreKeys = ['question', 'question_title', 'description_text']
    ignoreKeys.forEach(k => delete pureAnswer[k])

    let answers = {}

    for (let [key, value] of Object.entries(pureAnswer)) {
      if (!answers[value]) {
        answers[value] = [key]
      } else {
        answers[value].push(key)
      }
    }

    return {
      ...arr,
      answers
    }
  })
};

const Question = styled(Grid)`
  margin-top: ${theme.spacing(2)}px;
  margin-bottom: ${theme.spacing(2)}px;
`

const AvatarChartConatiner = styled(Grid)`
  .group {
    padding: ${theme.spacing(0.5)}px;
    text-align: center;
    .ppl-count {
      color: ${theme.palette.primary.main};
  }
}


${theme.breakpoints.up('sm')} {
  .group {
  }
  .group:not(:last-child) {
    border-right: 1px ${theme.palette.divider} solid;
  }
}

`
const AvatarContainer = styled(Grid)`
  .avatar {
    width: 64px;
    height: 64px;
  }

  .name {
    margin: ${theme.spacing(1)}px;
  }
`

const AvatarChart = props => {
  const { answers } = props
  return <AvatarChartConatiner container justify='space-around'>
    {Object.entries(answers).map(pair => {
      const [label, ppl] = pair
      return <Grid className='group' item xs={12} sm>
        <Typography variant="h3" className='ppl-count'>
          {ppl.length}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <Grid container justify='center'>
          {ppl.map(p => <AvatarContainer item>
            <Grid container direction='column' alignItems='center'>
              <Avatar className='avatar' alt={p} src="/static/images/avatar/1.jpg" />
              <span className='name'>{p}</span>
            </Grid>
          </AvatarContainer>)}
        </Grid>
      </Grid>
    })}
  </AvatarChartConatiner>
}



function App() {
  const res = useFetch(`https://docs.google.com/spreadsheets/d/e/2PACX-1vTDHXuMnpG9pwpg4nmDzzT0uLeXwx6DsoKmbmDP0Md-ljfmngZk54ldm8drFhpyqdMQeChwN5Te0TCS/pub?gid=2129939499&single=true&output=csv`, {});
  if (!res.response) {
    return <div>Loading...</div>
  }


  const data = groupAnswers(res.response)


  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        {data.map(dat => {
          return <Question container spacing={3}>
            <Grid item xs={12}>
              <Container maxWidth="md">
                <Typography variant="h4" gutterBottom>{dat.question_title}</Typography>
                <Typography variant="body1" paragraph>{dat.description_text}</Typography>
              </Container>
              <AvatarChart answers={dat.answers} />
            </Grid>
          </Question>
        })}

      </Container>
    </ThemeProvider>
  )
}

export default App;
