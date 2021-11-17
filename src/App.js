import React from 'react'
import styled, { keyframes } from 'styled-components'

import 'bootstrap/dist/css/bootstrap.min.css'

const FadeIn = ({ duration = 300, delay = 0, index, children }) => {
    
  // use index if provided
  delay = index || delay

  const fadeIn = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;
  
  const Wrapper = styled.div`
    animation-name: ${fadeIn};
    animation-fill-mode: backwards;
    animation-duration: ${ () => duration + 'ms'};
    animation-delay: ${ () => (delay * 100) + 'ms'};
  `;
  
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
};

function App() {

  const StyledButton = styled.button`
    text-transform: uppercase;
    font-family: "Anton", arial;
    letter-spacing: 2px;
  `

  const StyledImage = styled.img`    
    transition: all 0.15s;
    object-fit: cover;

    &:hover {
      transform: scale(1.1);
      transition: all 0.15s;
    }
  `

  const [jsonData, setJsonData] = React.useState(null)
  const [sortedByDate, setSortedByDate] = React.useState(true)
  const [sortedByLikes, setSortedByLikes] = React.useState(false)

  function handleSortByLikes() {
		let sortedByLikes = jsonData.sort( (a, b) => {
			return b.likes - a.likes;
		});

    setJsonData(sortedByLikes)
    setSortedByDate(false)
    setSortedByLikes(true)
	}

	function handleSortByDate() {
		let sortedByDate = jsonData.sort( (a, b) => {
			return b.timestamp - a.timestamp;
		});

		setJsonData(sortedByDate)
    setSortedByDate(true)
    setSortedByLikes(false)
	}

  React.useEffect(() => {
    async function fetchCuralateApiData() {
      const curalateResponse = await fetch('https://api-2.curalate.com/v1/media/YHDipRCQulmbgNYF?limit=20')
      const responseData = await curalateResponse.json()
      // filter out only insta image posts, no vids
      let filteredData = responseData.data.items.filter( elem => (elem.source.type === 'instagram' && elem.media.type !== 'video'));
    
      let formattedData = filteredData.map( elem => {
        return {
          id: elem.id,
          image_url: elem.media.large.link,
          timestamp: elem.source.postedTimestamp,
          likes: elem.source.likeCount
        }
      })

      setJsonData(formattedData.slice(0,6))
    }

    fetchCuralateApiData()
  }, [])

  return (
    <div className="App main">
      <div className="container-fluid m-3">
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <StyledButton 
              className={`
                btn m-3 p-4 border-dark
                ${sortedByLikes ? 'bg-dark text-white' : ''}
              `}  
              onClick={handleSortByLikes}
            >
              <span className="h3">Most Liked</span>
            </StyledButton>
            <StyledButton 
              className={`
                btn m-3 p-4 border-dark
                ${sortedByDate ? 'bg-dark text-white' : ''}
              `} 
              active={sortedByDate} 
              onClick={handleSortByDate}
            >
              <span className="h3">Most Recent</span>
            </StyledButton>
          </div>
        </div>
        <div className="row justify-content-center">
          
            {
              jsonData ?
                jsonData.map( (elem, index) =>
                  <div key={elem.id} className="col-md-4 p-3 feed-item">
                    <FadeIn index={index}>
                      <StyledImage src={elem.image_url} className="feed-image img-thumbnail p-3" alt="product" />
                    </FadeIn>
                  </div>
                )
              :
                null
            }
          
        </div>
      </div>
    </div>
  )
}

export default App;
