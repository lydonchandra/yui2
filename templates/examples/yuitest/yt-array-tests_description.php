<h2 class="first">Array Assertions</h2>

<p>This example uses the <a href="/yui/yuitest/#arrayassert"><code>ArrayAssert</code></a> object to test methods on JavaScript's
  built-in <code>Array</code> object. The intent of this example is to introduce <code>ArrayAssert</code> and its methods
  as an alternative to the generic methods available on <a href="/yui/yuitest/#assert"><code>Assert</code></a>.</p>
<p>The example begins by creating an example namespace and <a href="/yui/yuitest/#testcase"><code>TestCase</code></a>:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.namespace("example.yuitest");  
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({

    name: "Array Tests",
    
    //-------------------------------------------------------------------------
    // Setup and teardown
    //-------------------------------------------------------------------------

    /*
     * The setUp() method is used to setup data that necessary for a test to
     * run. This method is called immediately before each test method is run,
     * so it is run as many times as there are test methods.
     */
    setUp : function () {        
        this.data = new Array (0,1,2,3,4,5);        
    },
    
    /*
     * The tearDown() method is used to clean up the initialization that was done
     * in the setUp() method. Ideally, it should free up all memory allocated in
     * setUp(), anticipating any possible changes to the data. This method is called
     * immediately after each test method is run.
     */
    tearDown : function () {
        delete this.data;
    },
    
    ...
});
</textarea>
<p>This <code>TestCase</code> has a <code>setUp()</code> method that creates an array for all the tests to use, as well as
  a <code>tearDown()</code> method that deletes the array after each test has been executed. This array is used throughout
  the tests as a base for array manipulations.</p>
  
<h3>Testing <code>push()</code></h3>
<p>The first test is <code>testPush()</code>, which tests the functionality of the <code>Array</code> object's <code>push()</code> method
  (other methods hidden for simpicity):</p> 
  
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({
    
    ...
    
    testPush : function() {
    
        //shortcut variables
        var ArrayAssert = YAHOO.util.ArrayAssert;
    
        //do whatever data manipulation is necessary
        this.data.push(6);
    
        //array-specific assertions
        ArrayAssert.isNotEmpty(this.data, "Array should not be empty.");
        ArrayAssert.contains(6, this.data, "Array should contain 6.");
        ArrayAssert.indexOf(6, this.data, 6, "The value in position 6 should be 6.");
        
        //check that all the values are there
        ArrayAssert.itemsAreEqual([0,1,2,3,4,5,6], this.data, "Arrays should be equal.");       
        
    },    
    
    ...
});
</textarea>
<p>The test begins by setting up a shortcut variables for <code>ArrayAssert</code>, then pushes the value 6 onto
  the <code>data</code> array (which was created by <code>setUp()</code>). Next, <code>ArrayAssert.isNotEmpty()</code> determines if the
  array has at least one item; this should definitely pass because the <code>push()</code> operation only adds values to the array. To determine 
  that the new value, 6, is in the array, <code>ArrayAssert.contains()</code> is used. The first argument is the value to look for and the second
  is the array to look in. To find out if the new value ended up where it should have (the last position, index 6), <code>ArrayAssert.indexOf()</code>
  is used, passing in the value to search for as the first argument, the array to search in as the second, and the index at which the value should
  occur as the final argument. Since 6 was pushed onto the end of an array that already had 6 items, it should end up at index 6 (the length of the
  array minus one). As a final test, <code>ArrayAssert.itemsAreEqual()</code> is used to determine that all of the items in the array are in the
  correct place. The first argument of this method is an array that has all of the values that should be in the array you're testing. This assertion
  passes only when the values in both arrays match up (the values are equal and the positions are the same).</p>
  
<h3>Testing <code>pop()</code></h3>
<p>The next test is <code>testPop()</code>, which tests the functionality of the <code>Array</code> object's <code>pop()</code> method:</p> 
  
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({
    
    ...
    
    testPop : function() {
    
        //shortcut variables
        var Assert = YAHOO.util.Assert;
        var ArrayAssert = YAHOO.util.ArrayAssert;
    
        //do whatever data manipulation is necessary
        var value = this.data.pop();
        
        //array shouldn't be empty
        ArrayAssert.isNotEmpty(this.data, "Array should not be empty.");                
    
        //basic equality assertion - expected value, actual value, optional error message
        Assert.areEqual(5, this.data.length, "Array should have 5 items.");
        Assert.areEqual(5, value, "Value should be 5.");   
        
        ArrayAssert.itemsAreSame([0,1,2,3,4], this.data, "Arrays should be equal.");    
        
    },    
    
    ...
});
</textarea>
<p>This test also starts out by creating some shortcut variables, for <code>Assert</code> and <code>ArrayAssert</code>. Next, the <code>pop()</code>
  method is called, storing the returned item in <code>value</code>. Since <code>pop()</code> should only remove a single item, <code>ArrayAssert.isNotEmpty()</code>
  is called to ensure that only one item has been removed. After that, <code>Assert.areEqual()</code> is called twice: once to check the
  length of the array and once to confirm the value of the item that was removed from the array (which should be 5). The last assertion uses
  <code>ArrayAssert.itemsAreSame()</code>, which is similar to <code>ArrayAssert.itemsAreEqual()</code> in that it compares values between two
  arrays. The difference is that <code>ArrayAssert.itemsAreSame()</code> uses strict equality (<code>===</code>) to compare values, ensuring that
  no behind-the-scenes type conversions will occur (this makes <code>ArrayAssert.itemsAreSame()</code> more useful for working with arrays of
  objects).</p>
  
<h3>Testing <code>reverse()</code></h3>
<p>The next test is <code>testReverse()</code>, which tests the functionality of the <code>Array</code> object's <code>reverse()</code> method:</p> 
  
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({
    
    ...
    
    testReverse : function() {
    
        //shortcut variables
        var ArrayAssert = YAHOO.util.ArrayAssert;
    
        //do whatever data manipulation is necessary
        this.data = this.data.reverse();
        
        ArrayAssert.itemsAreEqual([5,4,3,2,1,0], this.data, "Arrays should be equal.");   
        
    },    
    
    ...
});
</textarea>
<p>The <code>testRemove()</code> method is very simple, calling <code>reverse()</code> on the array and then testing the result. Since
  every item in the array has changed, the changes can be tested by calling <code>ArrayAssert.itemsAreEqual()</code> once (instead of
  calling <code>ArrayAssert.indexOf()</code> multiple times). The first argument is an array with all the values in the reverse order
  of the array that was created in <code>setUp()</code>. When compared with the second argument, the newly reversed array, the values in
  each position should be equal.</p>
  
<h3>Testing <code>shift()</code></h3>
<p>The next test is <code>testShift()</code>, which tests the functionality of the <code>Array</code> object's <code>shift()</code> method:</p> 
  
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({
    
    ...
    
    testShift : function() {
    
        //shortcut variables
        var Assert = YAHOO.util.Assert;
        var ArrayAssert = YAHOO.util.ArrayAssert;
    
        //do whatever data manipulation is necessary
        var value = this.data.shift();
    
        //array shouldn't be empty
        ArrayAssert.isNotEmpty(this.data, "Array should not be empty.");                
    
        //basic equality assertion - expected value, actual value, optional error message
        Assert.areEqual(5, this.data.length, "Array should have 6 items."); 
        Assert.areEqual(0, value, "Value should be 0."); 
        
        ArrayAssert.itemsAreEqual([1,2,3,4,5], this.data, "Arrays should be equal.");   
        
    },    
    
    ...
});
</textarea>
<p>The <code>shift()</code> method removes the first item in the array and returns it (similar to <code>pop()</code>, which removes the item
  from the end). In the <code>testShift()</code> method, <code>shift()</code> is called and the item is stored in <code>value</code>. To ensure
  that the rest of the array is still there, <code>ArrayAssert.isNotEmpty()</code> is called. After that, <code>Array.areEqual()</code> is
  called twice, once to test the length of the array and once to test the value that was returned from <code>shift()</code> (which should be
  0). As a last test, the entire array is tested using <code>ArrayAssert.itemsAreEqual()</code> to ensure that all of the items have shifted
  into the appropriate positions in the array.</p>
  
<h3>Testing <code>splice()</code></h3>
<p>The next test is <code>testSplice()</code>, which tests the functionality of the <code>Array</code> object's <code>splice()</code> method:</p> 
  
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({
    
    ...
    
    testSplice : function() {
    
        //shortcut variables
        var Assert = YAHOO.util.Assert;
        var ArrayAssert = YAHOO.util.ArrayAssert;
    
        //do whatever data manipulation is necessary
        var removed = this.data.splice(1, 2, 99, 100);
    
        //basic equality assertion - expected value, actual value, optional error message
        Assert.areEqual(6, this.data.length, "Array should have 6 items.");              
    
        //the new items should be there
        ArrayAssert.indexOf(99, this.data, 1, "Value at index 1 should be 99.");   
        ArrayAssert.indexOf(100, this.data, 2, "Value at index 2 should be 100.");   
        
        ArrayAssert.itemsAreEqual([0,99,100,3,4,5], this.data, "Arrays should be equal.");  
        ArrayAssert.itemsAreEqual([1,2], removed, "Removed values should be an array containing 1 and 2."); 
        
    },    
    
    ...
});
</textarea>
<p>The <code>splice()</code> method is one of the most powerful <code>Array</code> manipulations. It can both remove and add any number of items
  from an array at the same time. This test begins by splicing some values into the array. When calling <code>splice()</code>, the first argument
  is 1, indicating that values should be inserted at index 1 of the array; the second argument is 2, indicating that two values should be
  removed from the array (the value in index 1 and the value in index 2); the third and fourth arguments are values that should be inserted
  into the array at the position given by the first argument. Essentially, values 1 and 2 should end up being replaced by values 99 and 100 in
  the array.</p>
<p>The first test is to determine that the length of the array is still 6 (since the previous step removed two items and then inserted two, the
  length should still be 6). After that, <code>Assert.indexOf()</code> is called to determine that the values of 99 and 100 are in positions
  1 and 2, respectively. To ensure the integrity of the entire array, <code>ArrayAssert.itemsAreEqual()</code> is called on the array, comparing
  it to an array with the same values. The very last step is to test the value returned from <code>splice()</code>, which is an array containing
  the removed values, 1 and 2. <code>ArrayAssert.itemsAreEqual()</code> is appropriate for this task as well.</p>  
  
<h3>Testing <code>unshift()</code></h3>
<p>The next test is <code>testUnshift()</code>, which tests the functionality of the <code>Array</code> object's <code>unshift()</code> method:</p> 
  
<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.example.yuitest.ArrayTestCase = new YAHOO.tool.TestCase({
    
    ...
    
    testUnshift : function() {
    
        //shortcut variables
        var Assert = YAHOO.util.Assert;
        var ArrayAssert = YAHOO.util.ArrayAssert;
    
        //do whatever data manipulation is necessary
        this.data.unshift(-1);
    
        //basic equality assertion - expected value, actual value, optional error message
        Assert.areEqual(7, this.data.length, "Array should have 7 items."); 

        //the new item should be there
        ArrayAssert.indexOf(-1, this.data, 0, "First item should be -1."); 
    
        ArrayAssert.itemsAreEqual([-1,0,1,2,3,4,5], this.data, "Arrays should be equal.");     
        
    },    
    
    ...
});
</textarea>
<p>Working similar to <code>push()</code>, <code>unshift()</code> adds a value to the array, but the item is added to the front (index 0) instead of
  the back. This test begins by adding the value -1 to the array. The first assertion determines if the length of the array has been incremented
  to 7 to account for the new value. After that, <code>ArrayAssert.indexOf()</code> is used to determine if the value has been placed in the
  correct location. The final assertions tests that the entire array is expected by using <code>ArrayAssert.itemsAreEqual()</code>.</p>
  
<h3>Running the tests</h3>

<p>With all of the tests defined, the last step is to run them. This initialization is assigned to take place when the document tree has been 
  completely loaded by using the Event utility's <code>onDOMReady()</code> method:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YAHOO.util.Event.onDOMReady(function (){

    //create the logger
    var logger = new YAHOO.tool.TestLogger();
    
    //add the test suite to the runner's queue
    YAHOO.tool.TestRunner.add(YAHOO.example.yuitest.ArrayTestCase);

    //run the tests
    YAHOO.tool.TestRunner.run();
});
</textarea> 

<p>Before running the tests, it's necessary to create a <code>TestLogger</code> object to display the results (otherwise the tests would run 
  but you wouldn't see the results). After that, the <code>TestRunner</code> is loaded with the <code>TestSuite</code> object by calling 
  <code>add()</code> (any number of <code>TestCase</code> and <code>TestSuite</code> objects can be added to a <code>TestRunner</code>, 
  this example only adds one for simplicity). The very last step is to call <code>run()</code>, which begins executing the tests in its
  queue and displays the results in the <code>TestLogger</code>.</p>