---
title: Alias
description: 'The alias command allows you to define'
tags:
  - Help files
  - Commands
---
The **alias** command allows you to define
abbreviations for long commands frequently used, thus minimizing your
typing.

Usage:

<div class="wiki-block">

 alias                                list aliases<br> alias `&lt;word&gt;`                         delete alias<br> alias `&lt;word&gt;` `&lt;expansion&gt;`             define alias<br> alias please remove all of them      (sic!) delete all aliases

</div>

You cannot define "alias", or any of its abbreviations except "a" as an
alias.

The character "&" (ampersand) acts as a placeholder for arguments to
your alias. The rest of the line (after your alias) is inserted where &
is found in the definition.

If &lt;expansion&gt; does not contain any "&", any following words will be
added to the end of the command.

If &lt;word&gt; starts with a "%" it is a "keyword alias" which will be
expanded whenever a keyword lookup is done to find a character,
object, or [door](./Door.md).

Some words cannot be used as keyword aliases: words that the
[look](./Look.md) command treats specially ("at", "around",
"north", "east", ...) and some prepositions like "in", "from", and
"with".

To inhibit keyword alias expansion, you prepend the word in a command
with "%".

Examples:

<div class="wiki-block">

\> alias dw drink water<br>\> dw               -> drink water<br>\> alias ko kill &.orc<br>\> ko 2             -> kill 2.orc<br>\> alias rb ride behind<br>\> rb gandalf       -> ride behind gandalf<br>\> alias %o orc<br>\> kill o           -> kill orc<br>\> alias %sword longsword<br>\> wield sword      -> wield longsword<br>\> wield %sword     -> wield sword

</div>
