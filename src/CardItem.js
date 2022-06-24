import '@aws-amplify/ui-react/styles.css';
import {
    Card,
    View,
    Heading,
    Flex,
    Text,
    Button,
    useTheme,
    Divider,
    ScrollView
} from '@aws-amplify/ui-react';

const CardItem = (props) => {
  
  console.log(props.content)
  const { tokens } = useTheme();
  return (
    <View
      backgroundColor="black"
      padding="10px 30px 30px 30px"
    > 
      <Heading level={5} color="white" padding="10px"fontStyle="italic" fontFamily="serif">
        {props.link} 
      </Heading>
      <Card padding="30px">
        <Flex direction="row" alignItems="flex-start">
          <Flex direction="column" alignItems="flex-start" gap={tokens.space.xs} >
            <Flex justifyContent="space-between" padding="20px">
                  <Heading level={5}>{props.title}</Heading>
                  <Divider orientation="vertical"/>
                  <Heading level={6}> {props.subtitle} </Heading>                  
            </Flex>
            <ScrollView height="200px">
              <Text as="span">
                {props.content}
              </Text>
            </ScrollView>  
            { props.rank ? (
            <Button alignSelf="center" color="pink" backgroundColor="black">
              {props.rank}/10</Button>
              ):(<></>)}
          </Flex>
        </Flex>
      </Card>
    </View>
  );
};


export { CardItem }