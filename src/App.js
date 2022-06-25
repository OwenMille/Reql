import React, { useEffect, useState } from "react";
import { Amplify, API, Auth } from "aws-amplify";
import awsExports from './aws-exports';
import awsconfig from './aws-exports';
import '@aws-amplify/ui-react/styles.css';

import { 
  Authenticator, View, Button, Heading, Flex, Tabs, TabItem, Text
 } from '@aws-amplify/ui-react';
import { CardItem } from "./CardItem";

import * as mutations from './graphql/mutations';
import * as queries from './graphql/queries';
import NewCard from './NewCard'


Amplify.configure(awsconfig);
Amplify.configure(awsExports);


export default function App() {
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0);
  const [toggleState, setToggleState] = useState(false)

  useEffect(() => { cardList() }, []);

  return (
    <Authenticator>
    {({ signOut, user }) => (
      <View maxWidth="600px" margin="auto" >
          <Text fontSize="32px" fontStyle="italic" fontWeight="200"> Re:ql </Text>
          <Heading level={3} fontWeight="400"> {user.username} </Heading>
          <Flex direction="column" padding="30px">
            <Tabs spacing="equal" currentIndex={index} onChange={(i) => setIndex(i)}>
              <TabItem title="all posts">
                 <Text fontSize="24px" fontStyle="italic" 
                  padding="30px 30px 10px 350px" fontWeight="200">
                     Recent Posts </Text>

                  
                  <View title="postfeed">
                    { cards.map((card) => {
                        return (
                          <div className="cardContainer"key={card.id}>
                              <CardItem
                              title={card.title}
                              subtitle={card.subtitle}
                              content={card.content}
                              link={card.link}
                              rank={card.rank}
                              owner={card.owner}
                              />
                                  
                          </div>       
                        )}
                    )}
                  </View>    
              </TabItem>
              
              <TabItem title="add a card">
                <Heading padding="20px"> Add an opinion to Re:ql and it becomes fact. </Heading>
                <Text paddingLeft="40px">no one can judge you if there is no interaction!</Text>
                <NewCard  username={user.username} />
              </TabItem>
              
              <TabItem title="my profile">
                <Flex gap="60%" direction="row">
                  <Heading paddingTop="30px"> Your Posts: </Heading>
                  <Button margin="20px" backgroundColor="black" fontStyle="italic" 
                      variation="primary" size="small" onClick={signOut}> Sign Out </Button> 
                </Flex>
                    { cards.map((card) => {
                      const dateCreated = new Date(card.createdAt).toLocaleDateString();

                        return (
                          
                          <Flex key={card.id} direction="column" paddingLeft="10px">
                            <Flex padding="10px"direction="row" alignContent="center" >
                              
                                { card.owner==user.username ? (
                                  <div>
                                    <Text fontSize="0.9em">{dateCreated}</Text>
                                    <Text fontSize="1.5em">{card.title}</Text>
                                    
                                    <Button variation="link" padding="10px" onClick={()=>{setToggleState(true)}}>
                                       Delete post
                                    </Button> 
                                    { toggleState ? (
                                                  <Button size="small" onClick={()=>{deleteItem(card.id)}}>
                                                      Are you sure you want to delete this card?
                                                  </Button>) : ( <></> )
                                      }
                                  </div> ) : ( <></> ) }
                              </Flex>
                            </Flex>
                        )})}      
              </TabItem>
            </Tabs>
            
            </Flex>
        </View>    
    )}
    </Authenticator>
   );

  async function deleteItem(id) {
    const cardDetails = {
      id: {id}
    }
    try {
      const delCard = await API.graphql({ query: mutations.deletePost, variables: {input: cardDetails.id}});
      console.log(delCard)
    }
    catch(err){console.log(err)}
  }

  async function cardList() {
    try {
      const allCards = await API.graphql({ query: queries.listPosts });
      const cards = allCards.data.listPosts.items
      console.log(cards)
      setCards(cards)
       
    } catch (err) { console.log('error fetching cards') }
  }
}
