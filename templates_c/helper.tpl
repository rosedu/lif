{if $helpers neq 'false'}
<table style="margin-left: auto; margin-right: auto;" border="1">
{foreach $helpers as $h}
	<tr class="rand" id="helper{$h.id}" onclick='SelectRow("helper",{$h.id})' >
		<td style="width: auto;">{$h.name}</td>
		<td style="width: 80px; text-align: center">{if $h.busy eq 1}Unavailable{else}Available{/if}</td>
		<td style="width: 90px; text-align: center">{if $h.status eq 1}Assigned {else}Not assigned{/if}</td>
		{*<td style="width: auto;">{$participants_list[$h.id]}</td>*}
		<td style="width: auto;">{$participants_count[$h.id]}</td>
		<td>{$h.date_reg}</td>
	</tr>
{/foreach}
</table>
{else}No Helpers here.{/if}
