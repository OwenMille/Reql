import React from "react";
import { API } from "aws-amplify"
import * as mutations from './graphql/mutations';
import {
  Flex,
  View,
  Button,
  TextField,
  TextAreaField,
  Alert,
  CheckboxField
} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css';



const formState = { 
  id: "",
  title: "",
  subtitle: "",
  content: "",
  link: "",
  rank: ""
}

function updateFormState(key, value) {
  formState[key] = value
}


export default function NewCard(username) {
  const [checked, setChecked] = React.useState(false);


  async function confirm() {
    if (checked==true) {
      updateFormState('link', 'anonymous')
    }
    try {
    let intRank=parseInt(formState.rank);
    updateFormState('rank', intRank)
    updateFormState('id', username.username + Date.now())
    updateFormState('owner', username.username )
    postCard()
    } catch (err) { console.log("Error gathering post information. Try again.") }
  }
  
  async function postCard() {
    try {
      const uploadItem = await API.graphql({ 
        query: mutations.createPost, variables: {input: formState}
      });
      console.log("Success" + uploadItem)
      window.location.reload(false)
    } catch (err) {
       console.log('Error adding post.') 
      }
  }
  return (
      <Flex direction="column" maxWidth="500px">
        <View padding="30px"/>
          <TextField
            variation='primary'
            placeholder="Title of Post"
            fontWeight="300"
            onChange={e => updateFormState('title', e.target.value)}
          />
          <TextField
            fontWeight="300"
            placeholder="Post Subtitle (the author, your reaction, etc.)"
            name="subtitle"
            direction="column"
            inputMode="text"
            onChange={e => updateFormState('subtitle', e.target.value)}
          />
          <TextAreaField
            labelHidden={false} 
            name="content"
            rows="3"
            placeholder="Content"
            size="small"
            onChange={e => updateFormState('content', e.target.value)}
          />
          <TextField
            size="small"
            fontWeight="800"
            placeholder="Give the item a numbered score"
            onChange={e => updateFormState('rank', e.target.value)}
          />
          <Flex direction="row" margin="auto" padding ="15px">
          
          <CheckboxField
            name="subscribe-controlled"
            value="yes"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            label="Post Anonymously"
            fontWeight="300"
          />

          <Button  
              variation="primary"
              onClick={() => {confirm()}}> Create Post
          </Button> 
            
          </Flex>       
        
      </Flex>
      
    
    )
}